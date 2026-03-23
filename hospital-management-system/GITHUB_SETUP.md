# GitHub Setup — Step by Step

## Step 1: Create the GitHub Repo

1. Open https://github.com/new
2. Repository name: `medichain-hms`
3. Set to **Private** (hospital data — never public)
4. Skip README, .gitignore, license (we have them already)
5. Click Create

## Step 2: Open terminal inside the project folder

```bash
cd hospital-management-system
```

## Step 3: Git init + push

```bash
git init
git branch -M main
git add .
git commit -m "feat: MediChain HMS — full system initial commit"
git remote add origin https://github.com/YOURUSERNAME/medichain-hms.git
git push -u origin main
```

## Step 4: Create develop branch

```bash
git checkout -b develop
git push -u origin develop
```

## Step 5: Protect main branch

GitHub → Settings → Branches → Add rule:
- Branch name pattern: `main`
- ✅ Require pull request before merging
- ✅ Require status checks to pass (CI build)
- ✅ Restrict who can push

## Step 6: Add GitHub Secrets (for CI/CD)

GitHub → Settings → Secrets and variables → Actions:

| Name | Value |
|------|-------|
| DOCKERHUB_USERNAME | your docker hub user |
| DOCKERHUB_TOKEN | docker hub access token |
| SERVER_HOST | your server IP |
| SERVER_USER | ubuntu (or root) |
| SERVER_SSH_KEY | contents of id_rsa private key |

After that, every push to `main` will:
1. Build the project with Maven
2. Run tests
3. Build Docker image
4. Push to Docker Hub
5. SSH into server and redeploy

## Future feature workflow

```bash
git checkout develop
git checkout -b feature/billing-module
# ... make changes ...
git add .
git commit -m "feat: billing module with Razorpay integration"
git push origin feature/billing-module
# Open Pull Request on GitHub: feature/billing-module → develop
```
