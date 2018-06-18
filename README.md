# saladcalculator

## build

```
rm -rf docs/*
parcel build --no-cache --no-source-maps --out-dir docs  --public-url ./
mv docs/*.html index.html
```

