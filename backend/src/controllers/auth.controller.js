const { Pool } = require("pg");
const format = require('pg-format'); // Importation de l'outil de formatage sécurisé


// Fonction de login (tentative de connexion via identifiants PostgreSQL)
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Nom d'utilisateur et mot de passe requis"
    });
  }

  try {
    // Création d'un pool temporaire avec les identifiants fournis
    const userPool = new Pool({
      user: username,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: password,
      port: process.env.DB_PORT,
    });

    // Test de connexion simple
    await userPool.query("SELECT 1");

    // Récupérer les permissions de l'utilisateur sur la table produits
    const permResult = await userPool.query(`
      SELECT 
        r.rolsuper,
        (
          SELECT COALESCE(JSON_AGG(privilege_type), '[]'::json)
          FROM information_schema.role_table_grants 
          WHERE grantee = r.rolname AND table_name = 'produits'
        ) as permissions
      FROM pg_roles r
      WHERE r.rolname = $1
    `, [username]);

    const row = permResult.rows[0];

    if (!row) {
      throw new Error("Utilisateur introuvable");
    }

    const isSuper = permResult.rows[0]?.rolsuper || false;
    const permissions = isSuper ? ['ALL'] : (permResult.rows[0]?.permissions || []);
    console.log("Permissions :", permissions);
    console.log("Result rows :", permResult.rows);

    

    // Important : on ferme immédiatement la connexion
    await userPool.end();

    // Stockage minimal dans la session
    req.session.user = {
      username,
      password,
      permissions,
      role: isSuper ? 'admin' : 'user',
      connectedAt: new Date(),
    };

    return res.status(200).json({
      message: "Connexion réussie",
      user: {
        username,
        role: isSuper ? 'admin' : 'user',
        permissions
      }
    });

  } catch (err) {
    console.error("Erreur login :", err.message);
    return res.status(401).json({
      message: "Identifiants PostgreSQL invalides"
    });
  }
};

// Fonction de logout
const logout = (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({
      message: "Pas de session active"
    });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur destroy session :", err);
      return res.status(500).json({
        message: "Erreur lors de la déconnexion"
      });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({
      message: "Déconnexion réussie"
    });
  });
};

// Gestion des utilisateurs (Rôles PostgreSQL)
const getUsers = async (req, res) => {
  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    // Liste des utilisateurs avec leurs permissions sur la table produits
    const result = await pool.query(`
      SELECT 
        r.rolname as name, 
        CASE WHEN r.rolsuper THEN 'admin' ELSE 'user' END as role,
        (
          SELECT COALESCE(JSON_AGG(privilege_type), '[]'::json)
          FROM information_schema.role_table_grants 
          WHERE grantee = r.rolname AND table_name = 'produits'
        ) as permissions
      FROM pg_roles r
      WHERE r.rolcanlogin = true 
      AND r.rolname NOT IN ('postgres', 'rdsadmin')
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  } finally {
    await pool.end();
  }
};


const createUser = async (req, res) => {
  const { name, password, role, permissions } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Nom et mot de passe requis" });
  }

  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    // 1. Créer le rôle de manière sécurisée
    // %I = Identifier (nom d'objet, sera mis entre doubles guillemets)
    // %L = Literal (valeur, sera mise entre simples guillemets et échappée)
    const sqlCreate = role === 'admin'
      ? format('CREATE ROLE %I WITH LOGIN PASSWORD %L SUPERUSER', name, password)
      : format('CREATE ROLE %I WITH LOGIN PASSWORD %L', name, password);

    // const sqlSeq = format('GRANT USAGE, SELECT, UPDATE ON SEQUENCE audit_log_id_audit_seq TO %I', name);


    await pool.query(sqlCreate);
    // await pool.query(sqlSeq);

    // 2. Accorder l'usage du schéma (Sécurisé avec %I)
    await pool.query(format('GRANT USAGE ON SCHEMA public TO %I', name));
    await pool.query(format('GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO %I', name));

    // 3. Accorder les permissions spécifiques
    if (role !== 'admin' && permissions && permissions.length > 0) {
      // On nettoie chaque permission pour éviter l'injection ici aussi
      const validPermissions = permissions.includes('ALL') ? ['ALL'] : permissions;
      
      // On construit la liste des privilèges (ex: SELECT, INSERT) 
      // Attention: on utilise %s ici car les privilèges sont des mots-clés SQL fixes
      const permsString = validPermissions.join(', '); 
      
      const sqlGrant = format('GRANT %s ON produits TO %I', permsString, name);
      await pool.query(sqlGrant);
    }

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error("Erreur création utilisateur :", err);
    res.status(500).json({ message: "Erreur lors de la création", detail: err.message });
  } finally {
    await pool.end();
  }
};
// const createUser = async (req, res) => {
//   const { name, password, role, permissions } = req.body;

//   if (!name || !password) {
//     return res.status(400).json({ message: "Nom et mot de passe requis" });
//   }

//   const pool = new Pool({
//     user: req.session.user.username,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: req.session.user.password,
//     port: process.env.DB_PORT,
//   });

//   try {
//     // 1. Créer le rôle
//     const createRoleQuery = role === 'admin'
//       ? `CREATE ROLE "${name}" WITH LOGIN PASSWORD '${password}' SUPERUSER`
//       : `CREATE ROLE "${name}" WITH LOGIN PASSWORD '${password}'`;

//     await pool.query(createRoleQuery);

//     // 2. Accorder l'usage du schéma
//     await pool.query(`GRANT USAGE ON SCHEMA public TO "${name}"`);
//     await pool.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO "${name}"`);

//     // 3. Accorder les permissions spécifiques sur la table produits
//     if (role !== 'admin' && permissions && permissions.length > 0) {
//       const validPermissions = permissions.includes('ALL') ? ['ALL'] : permissions;
//       const permsString = validPermissions.join(', ');
//       await pool.query(`GRANT ${permsString} ON produits TO "${name}"`);
//     }

//     res.status(201).json({ message: "Utilisateur créé avec succès" });
//   } catch (err) {
//     console.error("Erreur création utilisateur :", err);
//     res.status(500).json({ message: "Erreur lors de la création", detail: err.message });
//   } finally {
//     await pool.end();
//   }
// };

const updateUserPermissions = async (req, res) => {
  const { username } = req.params;
  const { permissions } = req.body;

  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    // 1. Révoquer toutes les permissions actuelles sur produits
    await pool.query(`REVOKE ALL ON produits FROM "${username}"`);

    // 2. Accorder les nouvelles permissions
    if (permissions && permissions.length > 0) {
      const validPermissions = permissions.includes('ALL') ? ['ALL'] : permissions;
      const permsString = validPermissions.join(', ');
      await pool.query(`GRANT ${permsString} ON produits TO "${username}"`);
    }

    res.json({ message: "Permissions mises à jour avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await pool.end();
  }
};

const deleteUser = async (req, res) => {
  const { username } = req.params;

  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    // 1. Révoquer tous les privilèges pour éviter les erreurs de dépendance
    await pool.query(`REVOKE ALL ON ALL TABLES IN SCHEMA public FROM "${username}"`);
    await pool.query(`REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM "${username}"`);
    await pool.query(`REVOKE USAGE ON SCHEMA public FROM "${username}"`);

    // 2. Supprimer le rôle
    await pool.query(`DROP ROLE "${username}"`);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression utilisateur :", err);
    res.status(500).json({ message: "Erreur lors de la suppression", detail: err.message });
  } finally {
    await pool.end();
  }
};

module.exports = {
  login,
  logout,
  getUsers,
  createUser,
  updateUserPermissions,
  deleteUser
};