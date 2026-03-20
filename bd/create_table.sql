-- Table de travail (ex: une liste de compte)
CREATE TABLE compte (
    id SERIAL PRIMARY KEY,
    n_compte VARCHAR(100) NOT NULL,
    nom_client VARCHAR(100) NOT NULL,
    solde DECIMAL(10,2)
);

-- Table d'Audit (Le registre du surveillant)
CREATE TABLE audit_compte (
    id_audit SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(50),            -- L'utilisateur connecté
    type_action VARCHAR(20),                -- INSERT, UPDATE ou DELETE
    table_concernee VARCHAR(50),            -- Nom de la table modifiée
    date_action TIMESTAMP DEFAULT NOW(),    -- Date et Heure précise
    machine_hote VARCHAR(50) ,               -- Optionnel : Nom du PC
    details TEXT                            -- Pour stocker ce qui a été modifié
);

