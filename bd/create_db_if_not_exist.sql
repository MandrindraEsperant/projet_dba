DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'administration_db'
   ) THEN
      EXECUTE 'CREATE DATABASE administration_db';
   END IF;
END
$$; 