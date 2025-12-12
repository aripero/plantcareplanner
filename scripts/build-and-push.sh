#!/bin/bash

# Script to build, commit, and push changes if build succeeds
# Usage: ./scripts/build-and-push.sh [commit-message]

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful!${NC}"
    
    # Check if there are changes to commit
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}Staging changes...${NC}"
        git add .
        
        # Get commit message from argument or use default
        COMMIT_MSG="${1:-Auto-commit: Build successful}"
        echo -e "${YELLOW}Committing changes...${NC}"
        git commit -m "$COMMIT_MSG"
        
        echo -e "${YELLOW}Pushing to remote...${NC}"
        git push
        
        echo -e "${GREEN}✓ Changes committed and pushed successfully!${NC}"
    else
        echo -e "${YELLOW}No changes to commit.${NC}"
    fi
else
    echo -e "${RED}✗ Build failed! Not committing changes.${NC}"
    exit 1
fi

