# 🐛 Troubleshooting Guide - Mavrix Insurance

## Common Issues and Solutions

### PWA Icon Download Errors

**Problem**: `Error while trying to use the following icon from the Manifest: https://your-domain.vercel.app/icon.png (Download error or resource isn't a valid image)`

**Causes**:
1. **Corrupted PNG file** - The icon.png file is damaged or invalid
2. **Vercel rewrite rules** - All routes redirecting to index.html
3. **File serving issues** - Static assets not being served correctly
4. **Invalid PNG format** - File doesn't follow PNG specifications

**Solutions**:

#### 1. Fix Vercel Configuration
Update your `vercel.json` to properly handle static assets:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-api-domain.vercel.app/api/$1"
    },
    {
      "source": "/icon.png",
      "destination": "/icon.png"
    },
    {
      "source": "/manifest.json",
      "destination": "/manifest.json"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/icon.png",
      "headers": [
        {
          "key": "Content-Type",
          "value": "image/png"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000"
        }
      ]
    }
  ]
}
```

#### 2. Verify Icon File Integrity
- Check if the icon.png file is actually a valid PNG
- Ensure the file size is reasonable (should be > 1KB)
- Try opening the file in an image editor

#### 3. Test Icon Accessibility
Use the test page: `/test-icon.html` to verify:
- Icon file is accessible via HTTP
- Content-Type is correct
- File loads without errors

#### 4. Alternative Solutions
If the PNG continues to fail:
- Convert to a different format (SVG, WebP)
- Use a different icon file
- Check for file corruption

### Email Issues

**Problem**: Emails not sending
**Solutions**:
1. Check environment variables
2. Verify SMTP credentials
3. Check email provider limits

**Problem**: Gmail authentication failed
**Solutions**:
1. Enable 2FA on Gmail
2. Use App Password, not regular password
3. Disable "Less secure app access"

### PWA Installation Issues

**Problem**: App not installing as PWA
**Solutions**:
1. Verify manifest.json is valid
2. Check all icons are accessible
3. Ensure HTTPS is enabled
4. Clear browser cache

**Problem**: Service worker not registering
**Solutions**:
1. Check sw.js file is in public folder
2. Verify service worker registration in index.html
3. Check browser console for errors

### Build Issues

**Problem**: Build fails
**Solutions**:
1. Check for syntax errors in code
2. Verify all dependencies are installed
3. Clear node_modules and reinstall
4. Check for conflicting package versions

**Problem**: Build succeeds but icons don't work
**Solutions**:
1. Verify icon files are in build directory
2. Check file permissions
3. Test locally before deploying
4. Verify Vercel configuration

## Testing and Debugging

### Local Testing
1. Run `npm run build` locally
2. Test with `serve -s build`
3. Check browser console for errors
4. Verify all assets load correctly

### Vercel Deployment Testing
1. Deploy to Vercel
2. Check Vercel build logs
3. Test deployed site
4. Use browser DevTools to debug

### Icon Testing
1. Access `/test-icon.html` on deployed site
2. Check network tab for failed requests
3. Verify Content-Type headers
4. Test different icon sizes

## Getting Help

If you continue to experience issues:

1. **Check the logs**: Look at browser console and Vercel build logs
2. **Test locally**: Ensure the issue isn't local-only
3. **Verify configuration**: Double-check all config files
4. **Check file integrity**: Ensure all assets are valid
5. **Review documentation**: Check this guide and other docs

---

**Note**: Most PWA icon issues are related to file corruption, server configuration, or deployment problems. Start with local testing and work your way up to production deployment.
