.#!/bin/bash
set -e

echo "======================================"
echo "🚀 بدء المرحلة الثانية"
echo "======================================"

echo ""
echo "1. فحص TypeScript..."
npm run typecheck

echo ""
echo "2. بناء المشروع..."
npm run build

echo ""
echo "======================================"
echo "✅ المرحلة الثانية تمت بنجاح"
echo "======================================"

echo ""
echo "الخطوة التالية:"
echo "1. npm run dev"
echo "2. افتح الموقع وتأكد أنه يعمل"
echo "3. git add ."
echo "4. git commit -m \"complete phase 2\""
echo "5. git push origin main"