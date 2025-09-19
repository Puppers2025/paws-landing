# 🔐 Vercel Environment Variables

## Required Environment Variables for Deployment

Copy these EXACTLY into your Vercel project settings:

```
NEXTAUTH_SECRET = 0f4c2665fbee3717d8120560f55515af35fcf09af9b1b68dbf3ba18e1c8a7ab8
NEXT_PUBLIC_APP_URL = https://paws-landing.vercel.app
NEXT_PUBLIC_APP_NAME = Paws Landing
NEXTAUTH_URL = https://paws-landing.vercel.app
ADMIN_EMAIL = admin@paws.com
ENABLE_ADMIN_PANEL = false
ENABLE_DEBUG_MODE = false
ENABLE_ANALYTICS = false
RATE_LIMIT_MAX_REQUESTS = 100
RATE_LIMIT_WINDOW_MS = 900000
```

## 📋 Step-by-Step Instructions

1. **Go to Vercel Dashboard**
2. **Select your project** (paws_landing)
3. **Go to Settings** → **Environment Variables**
4. **Add each variable** one by one:
   - Click "Add New"
   - Enter the **Name** (left side)
   - Enter the **Value** (right side)
   - Select **Environment**: Production, Preview, Development
   - Click "Save"

## ⚠️ Important Notes

- **Copy EXACTLY** - no extra spaces or characters
- **All environments** - add to Production, Preview, and Development
- **Case sensitive** - variable names must match exactly
- **No quotes** - don't wrap values in quotes

## 🔄 After Adding Variables

1. **Redeploy** your project
2. **Check logs** for any errors
3. **Test the site** to ensure everything works

---
**Generated**: September 19, 2024
