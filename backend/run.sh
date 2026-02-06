#!/bin/bash

echo "Starting backend !!!"
source venv/bin/activate
uvicorn main:app
