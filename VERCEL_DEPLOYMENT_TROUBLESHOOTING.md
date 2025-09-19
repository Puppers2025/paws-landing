# 🚀 Vercel Deployment Troubleshooting Guide

## 📋 Common Vercel Deployment Issues & Solutions

This guide documents all the issues encountered during the paws-landing deployment and their solutions for future reference.

---

## 🔧 Issue #1: Project Name Invalid Characters

### **Error:**
```
The name contains invalid characters. Only letters, digits, and underscores are allowed. Furthermore, the name should not start with a digit.
```

### **Root Cause:**
- Vercel doesn't allow hyphens (`-`) in project names
- Only letters, digits, and underscores (`_`) are allowed

### **Solution:**
1. **Update `package.json`:**
   ```json
   {
     "name": "paws_landing"  // Changed from "paws-landing"
   }
   ```

2. **Commit and push changes:**
   ```bash
   git add package.json
   git commit -m "fix: Update project name for Vercel deployment"
   git push origin main
   ```

3. **Use project name with underscores** in Vercel: `paws_landing`

---

## 🔧 Issue #2: Conflicting Vercel Configuration

### **Error:**
```
If `rewrites`, `redirects`, `headers`, `cleanUrls` or `trailingSlash` are used, then `routes` cannot be present.
```

### **Root Cause:**
- `vercel.json` had both `routes` and `headers` configurations
- Vercel doesn't allow both together

### **Solution:**
1. **Delete `vercel.json` completely:**
   ```bash
   rm vercel.json
   ```

2. **Next.js handles routing automatically**
3. **Security headers are in `next.config.mjs`**

---

## 🔧 Issue #3: Module Resolution Errors

### **Error:**
```
Module not found: Can't resolve '@/lib/security'
Module not found: Can't resolve '@/components/overview/hooks/overviewModals'
```

### **Root Cause:**
- Incorrect `jsconfig.json` configuration
- Wrong `@/` alias path mapping
- Mixed relative and absolute imports

### **Solution:**

1. **Fix `jsconfig.json`:**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./app/*"]
       }
     }
   }
   ```

2. **Update all `@/lib/` imports to relative paths:**
   ```javascript
   // From: import { InputValidator } from '@/lib/security'
   // To:   import { InputValidator } from '../../../lib/security'
   ```

3. **Fix component imports:**
   ```javascript
   // From: import LoadingScreen from '@/components/ui/LoadingScreen'
   // To:   import LoadingScreen from '../components/ui/LoadingScreen'
   ```

---

## 🔧 Issue #4: Next.js Configuration Warnings

### **Error:**
```
Invalid next.config.mjs options detected: Unrecognized key(s) in object: 'serverComponentsExternalPackages' at "experimental"
```

### **Root Cause:**
- Deprecated `experimental.serverComponentsExternalPackages` configuration

### **Solution:**
**Update `next.config.mjs`:**
```javascript
// From:
experimental: {
  serverComponentsExternalPackages: [],
}

// To:
serverExternalPackages: [],
```

---

## 🔧 Issue #5: Large File Upload Issues

### **Error:**
```
error: RPC failed; HTTP 400 curl 22 The requested URL returned error: 400
send-pack: unexpected disconnect while reading sideband packet
```

### **Root Cause:**
- GitHub has 100MB push limit
- Large images (32MB) exceeded limits

### **Solution:**
1. **Install Git LFS:**
   ```bash
   brew install git-lfs
   git lfs install
   ```

2. **Configure `.gitattributes`:**
   ```
   *.png filter=lfs diff=lfs merge=lfs -text
   *.jpg filter=lfs diff=lfs merge=lfs -text
   *.gif filter=lfs diff=lfs merge=lfs -text
   ```

3. **Add files with Git LFS:**
   ```bash
   git add .gitattributes
   git add public/images/
   git commit -m "assets: Add images with Git LFS"
   git push origin main
   ```

---

## 🔧 Issue #6: Vercel Cache Issues

### **Problem:**
- Vercel using old commits instead of latest changes
- Build errors persist despite fixes

### **Solution:**
1. **Force fresh deployment:**
   ```bash
   echo "# Force fresh deployment" >> README.md
   git add README.md
   git commit -m "deploy: Force fresh Vercel deployment"
   git push origin main
   ```

2. **Alternative - Delete and recreate project:**
   - Delete project in Vercel
   - Import fresh from GitHub
   - Use new project name

---

## 📝 Quick Reference Commands

### **Check Current Commit:**
```bash
git log --oneline -3
```

### **Force Fresh Deployment:**
```bash
echo "# Force deployment - $(git rev-parse --short HEAD)" >> README.md
git add README.md && git commit -m "deploy: Force fresh deployment" && git push origin main
```

### **Verify Import Paths:**
```bash
# Check for @/ imports that might be problematic
grep -r "@/lib/" app/
grep -r "@/components/" app/
grep -r "@/styles/" app/
```

### **Test Build Locally:**
```bash
npm run build
```

---

## 🎯 Prevention Checklist

### **Before Deployment:**
- [ ] **Project name** uses underscores, not hyphens
- [ ] **No `vercel.json`** with conflicting configurations
- [ ] **All imports** use correct relative paths
- [ ] **Large files** configured with Git LFS
- [ ] **Next.js config** uses current syntax
- [ ] **Test build locally** with `npm run build`

### **During Deployment:**
- [ ] **Use latest commit** (check Vercel logs)
- [ ] **Add all environment variables** before first deploy
- [ ] **Monitor build logs** for errors
- [ ] **Force fresh deployment** if cache issues

### **After Deployment:**
- [ ] **Test all pages** and functionality
- [ ] **Verify images** are loading
- [ ] **Check security features** are working
- [ ] **Test on mobile** devices

---

## 🚨 Emergency Recovery

### **If Deployment Completely Fails:**
1. **Delete Vercel project**
2. **Import fresh** from GitHub
3. **Use new project name** (e.g., `paws_landing_v2`)
4. **Add environment variables**
5. **Deploy**

### **If Images Don't Load:**
1. **Check Git LFS status:**
   ```bash
   git lfs ls-files
   ```

2. **Re-push with LFS:**
   ```bash
   git add .gitattributes
   git add public/images/
   git commit -m "fix: Re-add images with Git LFS"
   git push origin main
   ```

---

## 📊 Success Metrics

### **Deployment Success Indicators:**
- ✅ **Build completes** without errors
- ✅ **All pages load** correctly
- ✅ **Images display** properly
- ✅ **Forms work** with validation
- ✅ **Security headers** active
- ✅ **Mobile responsive**

---

**Last Updated:** September 19, 2024  
**Project:** paws-landing  
**Status:** ✅ Successfully Deployed  
**Commit:** 2cac7f7
