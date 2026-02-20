CREATE OR REPLACE FUNCTION generer_audit() 
RETURNS TRIGGER AS $$
DECLARE
    colonne_nom TEXT;
    details_modifs TEXT := '';
BEGIN
    -- Si c'est un UPDATE, on cherche ce qui a changé
    IF (TG_OP = 'UPDATE') THEN
        -- On transforme les lignes en JSON et on compare les clés/valeurs
        -- Cette boucle compare chaque champ de NEW avec celui de OLD
        FOR colonne_nom IN 
            SELECT key FROM json_each_text(row_to_json(NEW))
        LOOP
            IF (json_extract_path_text(row_to_json(NEW), colonne_nom) IS DISTINCT FROM 
                json_extract_path_text(row_to_json(OLD), colonne_nom)) THEN
                details_modifs := details_modifs || colonne_nom || ' ';
            END IF;
        END LOOP;
    END IF;

    -- On insère dans la table audit
    INSERT INTO audit_log(utilisateur, operation, details)
    VALUES (current_user, TG_OP, 'Colonnes modifiées : ' || details_modifs);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
