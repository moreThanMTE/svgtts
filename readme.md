# SVGTTS
Turn SVGs into TSX components, also allowing you to customize their height and width.

## how to use?
```bash
npx svgtts [your svg]
# if you want to customize the output file
npx svgtts [your svg] [path of output]
```



this will auto turn the svg into ./output.tsx

when using this component
```tsx
<YourComponent width={number} fillColor>
```
The `fillColor` is optional. If you don't use it, it will default to the SVG's original color.
