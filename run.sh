#!/bin/bash

cd $(dirname $0)
source .venv/bin/activate
cd backend
gunicorn -b unix:/tmp/olimpus.sock sportevent.wsgi:application
