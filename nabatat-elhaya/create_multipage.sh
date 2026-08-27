#!/bin/bash

# ==========================================
# Multi-Page Structure Generator
# ==========================================

echo "🚀 Creating multi-page structure..."

# Create pages directory
mkdir -p pages

# Create page templates
for page in about products spices herbs seeds contact; do
  if [ "$page" != "products" ]; then
    cp index.html "pages/${page}.html"
  fi
done

# Create product detail page
cp index.html "pages/product-detail.html"

# Create assets subdirectories
mkdir -p assets/images/products
mkdir -p assets/images/about
mkdir -p assets/images/hero

echo "✅ Multi-page structure created!"
echo ""
echo "📂 New Structure:"
echo "nabatat-elhaya/"
echo "├── index.html (Home)"
echo "├── pages/"
echo "│   ├── about.html"
echo "│   ├── products.html"
echo "│   ├── spices.html"
echo "│   ├── herbs.html"
echo "│   ├── seeds.html"
echo "│   ├── contact.html"
echo "│   └── product-detail.html"
echo "├── css/"
echo "├── js/"
echo "├── data/"
echo "└── assets/"
