# Security Checklist for TransPass

## Credential Security

### For Firebase API Keys:

1. ✅ **Revoke Exposed Keys**: 
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Find the exposed API key and click "Regenerate key" or create a new one
   - Delete the old, compromised key

2. ✅ **Use Environment Variables**:
   - Store all API keys in `.env.local` (for development) 
   - Configure environment variables on Vercel for production
   - Never commit `.env` files to the repository

3. ✅ **Update `.gitignore`**:
   - Make sure all environment files are listed in `.gitignore`
   - Add patterns for any files that might contain credentials
   - Add `*.backup` to prevent backup files with credentials

### For Firebase Admin SDK:

1. ✅ **Secure Service Account Keys**:
   - Revoke any exposed service account keys
   - Generate new service account keys when needed
   - Store securely as environment variables, never in code

2. ✅ **Least Privilege Principle**:
   - Assign the minimum required permissions to service accounts
   - Create separate service accounts for different functions

## Development Best Practices

1. ✅ **Pre-commit Hooks**:
   - Use tools like `git-secrets` to prevent accidental credential commits
   - Configure a secret scanning tool for your repository

2. ✅ **Regular Security Audits**:
   - Scan repository history for any exposed credentials
   - Review Firebase security rules regularly
   - Audit API key usage and permissions

3. ✅ **Documentation**:
   - Use placeholders in documentation examples
   - Clearly mark where actual credentials should be used
   - Provide instructions for securely handling credentials
