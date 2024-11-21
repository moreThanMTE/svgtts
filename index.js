#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath) {
  console.error('Usage: npx svgtts <input.svg> [output.tsx]')
  process.exit(1)
}

console.log(`Start processing ${inputPath}`)

function convertSvgToTsx(svgFilePath, outputFilePath) {
  const svgContent = fs.readFileSync(svgFilePath, 'utf-8')

  let ratio
  let fillValue

  // 提取文件名（不包括扩展名）
  const componentName = path.basename(svgFilePath, '.svg')

  // 将组件名的首字母大写
  const capitalizedComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

  // 匹配并提取 height、width 和 fill 属性值
  const modifiedSvgContent = svgContent.replace(
    /<svg([^>]*)>/,
    (match, group1) => {
      // 提取 height 和 width 属性值
      const heightMatch = group1.match(/\s*height=["']([^"']*)["']/)
      const widthMatch = group1.match(/\s*width=["']([^"']*)["']/)
      let heightValue = heightMatch ? heightMatch[1] : '100' // 默认值为 100
      let widthValue = widthMatch ? widthMatch[1] : '100' // 默认值为 100

      heightValue = heightValue.replace(/[a-zA-Z%]/g, '')
      widthValue = widthValue.replace(/[a-zA-Z%]/g, '')

      heightValue = parseFloat(heightValue)
      widthValue = parseFloat(widthValue)

      // 计算比例
      ratio = widthValue / heightValue

      // 提取 fill 属性值
      const fillMatch = group1.match(/\s*fill=["']([^"']*)["']/)
      fillValue = fillMatch ? fillMatch[1] : '#000000' // 默认值为黑色

      // 移除 height、width 和 fill 属性
      const cleanedAttributes = group1.replace(/\s*(height|width|fill)=["'][^"']*["']/g, '')

      // 返回替换后的 <svg> 标签，添加动态 height、width 和 fill
      return `<svg${cleanedAttributes} height={heightPx} width={widthPx} fill={fillColor}>`
    }
  )

  const tsxContent = `
  export default function ${capitalizedComponentName}({ height, fillColor = '${fillValue}' }: { height: number, fillColor?: string }) {
    const heightPx = height.toString() + 'px'
    const widthPx = (height * ${ratio}).toString() + 'px'
    return (
      ${modifiedSvgContent}
    )
  }
  `

  // 检查输出路径的目录是否存在，如果不存在则创建
  const outputDir = path.dirname(outputFilePath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(outputFilePath, tsxContent)
  console.log(`Converted ${svgFilePath} to ${outputFilePath}`)
}

if (fs.lstatSync(inputPath).isDirectory()) {
  const files = fs.readdirSync(inputPath)
  const outputDir = outputPath || path.join(process.cwd(), 'output')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.svg') {
      const svgFilePath = path.join(inputPath, file)
      const outputFilePath = path.join(outputDir, `${path.basename(file, '.svg')}.tsx`)
      convertSvgToTsx(svgFilePath, outputFilePath)
    }
  })
} else {
  const outputFilePath = outputPath || `${path.basename(inputPath, '.svg')}.tsx`
  convertSvgToTsx(inputPath, outputFilePath)
}