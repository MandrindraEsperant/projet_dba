CREATE OR REPLACE FUNCTION generer_audit() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log(
        nom_utilisateur, 
        type_action, 
        table_concernee, 
        date_action, 
        machine_hote, 
        details
    )
    VALUES (
        current_user,                     -- Utilisateur connecté
        TG_OP,                            -- INSERT, UPDATE, DELETE
        TG_TABLE_NAME,                     -- Table concernée
        NOW(),                             -- Date et heure actuelle
        inet_client_addr(),                -- Adresse IP du client (optionnel)
        CASE 
            WHEN TG_OP = 'INSERT' THEN row_to_json(NEW)::text
            WHEN TG_OP = 'UPDATE' THEN 'Avant: ' || row_to_json(OLD)::text || ' | Après: ' || row_to_json(NEW)::text
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::text
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;