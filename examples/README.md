# Install globally

Run the following command to install postcss-html globally

```base
npm install --global posthtml-rtl
```

# Try it

Try to convert the provided HTML example to RTL:

```base
posthtml-rtl --rtl=true main.html --output main-rtl.html
```

Also to LTR:

```base
posthtml-rtl --rtl=false main.html --output main-ltr.html
```
