-- Table de travail (ex: une liste de produits)
CREATE TABLE produits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prix DECIMAL(10,2),
    stock INTEGER
);

-- Table d'Audit (Le registre du surveillant)
CREATE TABLE audit_log (
    id_audit SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(50),            -- L'utilisateur connecté
    type_action VARCHAR(20),                -- INSERT, UPDATE ou DELETE
    table_concernee VARCHAR(50),            -- Nom de la table modifiée
    date_action TIMESTAMP DEFAULT NOW(),    -- Date et Heure précise
    machine_hote VARCHAR(50) ,               -- Optionnel : Nom du PC
    details TEXT                            -- Pour stocker ce qui a été modifié
);

