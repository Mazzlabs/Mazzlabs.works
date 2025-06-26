#!/bin/bash

# DNS Verification Script for mazzlabs.works
echo "=== DNS Verification for mazzlabs.works ==="
echo ""

echo "1. Checking A records..."
dig +short mazzlabs.works A
echo ""

echo "2. Checking CNAME for www..."
dig +short www.mazzlabs.works CNAME
echo ""

echo "3. Checking current nameservers..."
dig +short mazzlabs.works NS
echo ""

echo "4. Checking if GitHub Pages is reachable..."
curl -s -o /dev/null -w "%{http_code}" https://mazzlabs.github.io
echo " - GitHub Pages status"

echo ""
echo "=== Expected Results ==="
echo "A records should show: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153"
echo "CNAME should show: mazzlabs.github.io"
echo "Nameservers should show Cloudflare nameservers if configured"
echo "GitHub Pages should return: 200"
