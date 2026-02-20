DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'administartion_db'
   ) THEN
      EXECUTE 'CREATE DATABASE administartion_db';
   END IF;
END
$$;