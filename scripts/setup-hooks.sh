#!/bin/bash

# Setup script to install git hooks for automatic build and push

set -e

HOOKS_DIR=".git/hooks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "Setting up git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Copy pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

# Pre-commit hook: Build project before allowing commit
# This ensures no broken code is committed

echo "Running pre-commit hook: Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ Build successful! Proceeding with commit..."
    exit 0
else
    echo "✗ Build failed! Commit aborted."
    exit 1
fi
EOF

# Copy post-commit hook
cat > "$HOOKS_DIR/post-commit" << 'EOF'
#!/bin/bash

# Post-commit hook: Automatically push after successful commit
# Only pushes if build was successful (checked in pre-commit)

echo "Running post-commit hook: Pushing to remote..."
git push

if [ $? -eq 0 ]; then
    echo "✓ Changes pushed successfully!"
else
    echo "⚠ Push failed. You may need to push manually."
fi
EOF

# Make hooks executable
chmod +x "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/post-commit"

echo "✓ Git hooks installed successfully!"
echo ""
echo "Hooks configured:"
echo "  - pre-commit: Builds project before allowing commit"
echo "  - post-commit: Automatically pushes after successful commit"

