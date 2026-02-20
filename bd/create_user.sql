

-- Créer un utilisateur avec un mot de passe
CREATE USER admin_app WITH PASSWORD 'mon_mot_de_passe';

-- Donner tous les droits sur cette base à cet utilisateur
GRANT ALL PRIVILEGES ON DATABASE administartion_db TO admin_app;

