# 🖼️ Image Upload Guide for paws-landing

## Git LFS Setup (Already Configured)

This project uses Git LFS (Large File Storage) to handle large image files efficiently.

### ✅ Current Configuration
- **Git LFS installed** and configured
- **File types tracked**: `*.png`, `*.jpg`, `*.gif`
- **All images uploaded** successfully to GitHub

### 📁 Image Storage Locations

#### **Active Images** (in repository)
```
public/images/
├── Future9.png (background)
├── Gold3.png (character)
├── background-city.png (game background)
├── loading-pupper.gif (loading animation)
├── powerup-*.png (game powerups)
├── zombie*.png (game characters)
└── ... (all game assets)
```

#### **Backup Images** (safety backup)
```
../paws-landing-images-backup/
└── (Complete backup of all original images)
```

## 🚀 Future Image Upload Process

### **Adding New Images**
1. **Place images** in `public/images/` directory
2. **Add to Git LFS**:
   ```bash
   git add public/images/your-new-image.png
   git commit -m "assets: Add new image"
   git push origin main
   ```

### **Updating Existing Images**
1. **Replace** the image file in `public/images/`
2. **Commit changes**:
   ```bash
   git add public/images/updated-image.png
   git commit -m "assets: Update image"
   git push origin main
   ```

### **Bulk Image Upload**
1. **Copy images** to `public/images/`
2. **Add all images**:
   ```bash
   git add public/images/
   git commit -m "assets: Add multiple images"
   git push origin main
   ```

## ⚠️ Important Notes

### **File Size Limits**
- **Git LFS handles** large files automatically
- **No 100MB push limit** issues
- **All image types** supported (PNG, JPG, GIF)

### **Image Optimization Tips**
- **Compress images** before upload for better performance
- **Use appropriate formats**:
  - PNG for graphics with transparency
  - JPG for photographs
  - GIF for animations

### **Backup Strategy**
- **Always backup** original images before changes
- **Backup location**: `../paws-landing-images-backup/`
- **Keep backups** until deployment is confirmed

## 🔧 Troubleshooting

### **If Git LFS fails**
```bash
# Reinstall Git LFS
brew install git-lfs
git lfs install

# Re-add files
git add .gitattributes
git add public/images/
git commit -m "fix: Re-add images with Git LFS"
git push origin main
```

### **If images don't display**
1. Check file paths in code
2. Verify images are in `public/images/`
3. Check browser console for 404 errors
4. Ensure Git LFS files are properly synced

## 📋 Quick Reference

| Action | Command |
|--------|---------|
| Add single image | `git add public/images/image.png` |
| Add all images | `git add public/images/` |
| Commit changes | `git commit -m "assets: Description"` |
| Push to GitHub | `git push origin main` |
| Check LFS status | `git lfs ls-files` |

---

**Last Updated**: September 19, 2024  
**Status**: ✅ Working - All images successfully uploaded via Git LFS
