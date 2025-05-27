#!/bin/bash
cd /home/kavia/workspace/code-generation/marketmerge-19525-0577fb35/marketmerge_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

