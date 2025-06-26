# DNS Configuration for mazzlabs.works

## Required DNS Records for GitHub Pages

Add these records in your DNS provider (Cloudflare recommended):

### A Records (Root Domain)
```
Type: A     Name: @     Value: 185.199.108.153
Type: A     Name: @     Value: 185.199.109.153  
Type: A     Name: @     Value: 185.199.110.153
Type: A     Name: @     Value: 185.199.111.153
```

### CNAME Record (www subdomain)
```
Type: CNAME Name: www   Value: mazzlabs.github.io
```

### MX Records (Email - if needed)
```
Type: MX    Name: @     Value: mx1.improvmx.com    Priority: 10
Type: MX    Name: @     Value: mx2.improvmx.com    Priority: 20
```

## Cloudflare Setup Steps

1. **Sign up**: https://cloudflare.com (FREE)
2. **Add domain**: mazzlabs.works
3. **Copy nameservers**: Update at your domain registrar
4. **Add DNS records**: Use the A and CNAME records above
5. **Enable SSL**: Full (strict) mode
6. **Wait**: 24-48 hours for full propagation

## Verification Commands

Test your DNS setup:
```bash
# Check A records
dig mazzlabs.works A

# Check CNAME
dig www.mazzlabs.works CNAME

# Check nameservers
dig mazzlabs.works NS
```

## GitHub Pages Settings

1. Go to: https://github.com/Mazzlabs/Mazzlabs.github.io/settings/pages
2. Set Custom Domain: `mazzlabs.works`
3. Enable "Enforce HTTPS"
4. Wait for SSL certificate provisioning

## Free Email Options

- **ImprovMX**: Free email forwarding (joseph@mazzlabs.works → your-email@gmail.com)
- **Cloudflare Email Routing**: Free email forwarding
- **Google Workspace**: 14-day free trial, then paid
