#!/bin/bash


git add .
git commit -m "Subida de Olimpus"
git push

ssh miguel@172.201.241.238 "
    cd Olimpus
    git pull
	sudo rm -r .venv/
	python3 -m venv --prompt . .venv
	source .venv/bin/activate
    cd backend
    pip install gunicorn	
  	pip install -r requirements.txt
    pip install gunicorn
    python manage.py collectstatic
    cd ..
    chmod +x run.sh
    supervisorctl restart olimpus
    deactivate
    cd frontend
    npm run build
    cd
    sudo rm -r var/www/html/react/*
    sudo cp -r Olimpus/frontend/build/* var/www/html/react/
    sudo chown -R www-data:www-data var/www/html/react
    
    
"
