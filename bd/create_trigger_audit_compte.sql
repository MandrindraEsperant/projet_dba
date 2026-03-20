CREATE TRIGGER trigger_audit_compte
AFTER INSERT OR UPDATE OR DELETE
ON compte
FOR EACH ROW
EXECUTE FUNCTION generer_audit();

GRANT EXECUTE ON FUNCTION generer_audit() TO public;
GRANT INSERT ON audit_compte TO public;
