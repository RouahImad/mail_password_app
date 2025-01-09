# Git automation script to push changes to repo
echo "Starting git operations...";

git add .;
read -p "Enter the commit message: " msg;
git commit -m "$msg $(date +%Y-%m-%d_%H)";
git push;