-- Fichier : create_admin.sql
-- Crée un utilisateur admin pour PostgreSQL avec tous les droits

-- 1️⃣ Crée l'utilisateur/admin avec mot de passe
CREATE ROLE admin_user WITH LOGIN PASSWORD 'admin' SUPERUSER;

-- 2️⃣ Donne tous les privilèges sur le schéma public
GRANT USAGE ON SCHEMA public TO admin_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin_user;

-- 3️⃣ Accorder les futurs privilèges automatiquement
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO admin_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO admin_user;

-- 4️⃣ Vérification
\du