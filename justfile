format:
    black server/**/*.py
    yarn --cwd client prettier . --write

client:
    yarn --cwd ./client dev

server:
    cd ./server && ../venv/Scripts/python.exe manage.py runserver
