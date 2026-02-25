-- Vérifie si la base existe avant de créer
SELECT 'CREATE DATABASE administration_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'administration_db')
\gexec