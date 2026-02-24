CREATE TRIGGER trigger_audit_produits
AFTER INSERT OR UPDATE OR DELETE
ON produits
FOR EACH ROW
EXECUTE FUNCTION generer_audit();


GRANT EXECUTE ON FUNCTION generer_audit() TO public;
GRANT INSERT ON audit_log TO public;