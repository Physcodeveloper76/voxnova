@echo off
cd /d "c:\Users\athar\OneDrive\Desktop\VOX-main JK\VOX-main"

echo Initializing Repository...
git init

echo Adding files...
git add .

echo Committing code...
git commit -m "Initial commit for VoxNova"

echo Changing branch to main...
git branch -M main

echo Setting up remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/Physcodeveloper76/VoxNova.git

echo Pushing code to GitHub...
git push -u origin main

echo.
echo Process complete!
pause
