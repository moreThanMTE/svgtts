# SVGTTS

自动将svg转换为tsx组件，并且可以自定义大小和颜色

## how to use?
```bash
# 转换单个svg
npx svgtts [your svg]
# 自动生成同名.tsx文件 组件名为首字母大写的svg文件名

# 输出到指定路径
npx svgtts [your svg] [./path/to/output.tsx]

# 转换整个文件夹
npx svg tts [./path/to/svgs/]
# 自动输出到./output文件夹内

# 自定义路径
npx svgtts [./path/to/svgs/] [./path/to/output/]
```

## 调用组件时

传入height值会自动计算width 保持组件原始比例，单位为px

这里的fillColor是可选参数，默认为黑色 需要传入16进制颜色代码字符串
```tsx
<YourComponent height={number} fillColor>
```