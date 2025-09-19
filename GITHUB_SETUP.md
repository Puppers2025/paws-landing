# 🐙 GitHub Setup Guide for Paws Landing

## 🎯 **Repository Setup for Public Collaboration**

This guide will help you set up a GitHub repository for the paws-landing website, enabling public collaboration and major updates.

### **📋 Prerequisites:**
- GitHub account
- Git installed locally
- Vercel account (for deployment)

## 🚀 Step 1: Create GitHub Repository

### **Option A: Via GitHub Web Interface**
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Repository name: `paws-landing`
4. Description: `Secure Next.js landing page for Paws NFT project`
5. Visibility: **Public** (for collaboration)
6. Initialize with README: **No** (we already have files)
7. Add .gitignore: **No** (we already have one)
8. Choose a license: **MIT License** (recommended)
9. Click "Create repository"

### **Option B: Via GitHub CLI**
```bash
# Install GitHub CLI if not installed
# macOS: brew install gh
# Windows: winget install GitHub.cli
# Linux: curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg

# Login to GitHub
gh auth login

# Create repository
gh repo create paws-landing --public --description "Secure Next.js landing page for Paws NFT project" --license MIT
```

## 🔧 Step 2: Initialize Local Repository

```bash
# Navigate to project directory
cd /Users/user/Desktop/NFT2Me/paws-landing

# Initialize git if not already done
git init

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/paws-landing.git

# Add all files
git add .

# Commit initial version
git commit -m "Initial commit: Secure paws-landing website with comprehensive security measures

- ✅ Input validation and sanitization
- ✅ Security headers and CSP
- ✅ Admin panel authentication
- ✅ Environment variable security
- ✅ Rate limiting and CSRF protection
- ✅ Vercel deployment ready"

# Push to GitHub
git push -u origin main
```

## 🔐 Step 3: Configure Repository Settings

### **Repository Settings:**
1. Go to repository → Settings
2. **General:**
   - Repository name: `paws-landing`
   - Description: `Secure Next.js landing page for Paws NFT project`
   - Website: `https://paws-landing.vercel.app` (after deployment)

3. **Security:**
   - Enable "Vulnerability alerts"
   - Enable "Dependabot alerts"
   - Enable "Dependabot security updates"

4. **Branches:**
   - Default branch: `main`
   - Add branch protection rules:
     - Require pull request reviews
     - Require status checks
     - Require up-to-date branches

## 🛡️ Step 4: Security Configuration

### **Secrets and Variables:**
1. Go to repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Environment Variables (for CI/CD)
NEXT_PUBLIC_APP_URL=https://paws-landing.vercel.app
NEXT_PUBLIC_APP_NAME=Paws Landing
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://paws-landing.vercel.app
DATABASE_URL=your_database_url
OPENSEA_API_KEY=your_opensea_api_key
BLOCKCHAIN_RPC_URL=your_blockchain_rpc_url
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=your_admin_password_hash
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
ENABLE_ADMIN_PANEL=true
ENABLE_ANALYTICS=false
ENABLE_DEBUG_MODE=false
```

## 🔄 Step 5: Set Up GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run security check
      run: npm run security-check
    
    - name: Run linting
      run: npm run lint
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

## 👥 Step 6: Collaboration Setup

### **Branch Strategy:**
- `main` - Production branch (protected)
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### **Collaborator Permissions:**
1. Go to repository → Settings → Manage access
2. Add collaborators with appropriate permissions:
   - **Maintainer**: Full access (you)
   - **Developer**: Write access (for major updates)
   - **Contributor**: Read access (for community contributions)

### **Issue Templates:**
Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## 📝 Step 7: Documentation

### **README.md Update:**
Update the README.md with:

```markdown
# 🐾 Paws Landing

A secure, modern Next.js landing page for the Paws NFT project.

## 🚀 Features

- ✅ **Secure** - Comprehensive security measures
- ✅ **Modern** - Built with Next.js 15 and React 19
- ✅ **Responsive** - Mobile-first design
- ✅ **Fast** - Optimized for performance
- ✅ **Accessible** - WCAG compliant

## 🛡️ Security

This project implements comprehensive security measures:
- Input validation and sanitization
- Security headers and CSP
- Admin panel authentication
- Rate limiting and CSRF protection
- Environment variable security

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Security Audit](./SECURITY_AUDIT_FINAL.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

## 🔄 Step 8: Workflow for Major Updates

### **For Major Updates:**
1. Create feature branch: `git checkout -b feature/major-update`
2. Make changes and commit: `git commit -m "Add major feature"`
3. Push branch: `git push origin feature/major-update`
4. Create pull request on GitHub
5. Review and merge to `main`
6. Auto-deploy to Vercel

### **For Hotfixes:**
1. Create hotfix branch: `git checkout -b hotfix/critical-fix`
2. Make changes and commit: `git commit -m "Fix critical issue"`
3. Push branch: `git push origin hotfix/critical-fix`
4. Create pull request and merge immediately
5. Auto-deploy to Vercel

## ✅ Step 9: Verification

### **Checklist:**
- [ ] Repository created and configured
- [ ] Code pushed to GitHub
- [ ] Secrets configured
- [ ] GitHub Actions set up
- [ ] Branch protection enabled
- [ ] Issue templates created
- [ ] Documentation updated
- [ ] Vercel deployment connected

### **Test Deployment:**
1. Make a small change
2. Commit and push to `main`
3. Verify auto-deployment to Vercel
4. Check that the site is live

## 🎉 Success!

Your paws-landing repository is now:
- ✅ **Publicly accessible** for collaboration
- ✅ **Securely configured** with proper permissions
- ✅ **CI/CD ready** with GitHub Actions
- ✅ **Documentation complete** for contributors
- ✅ **Production ready** with Vercel deployment

**You can now collaborate publicly and make major updates! 🚀**

## 📞 Support

For issues with GitHub setup:
1. Check GitHub documentation
2. Verify repository permissions
3. Test with a small change first
4. Check Vercel deployment logs

**Happy collaborating! 🎉**
