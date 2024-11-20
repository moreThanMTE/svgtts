#!/usr/bin/env node

import fs from 'fs'

const inputPath = process.argv[2]
const outputPath = process.argv[3] || './output.tsx'

if (!inputPath) {
  console.error('Usage: trans <input.svg> [output.tsx]')
  process.exit(1)
}

const svgContent = fs.readFileSync(inputPath, 'utf-8')

// 匹配并删除 height 和 width 属性，同时保留其他属性
const modifiedSvgContent = svgContent.replace(
  /<svg([^>]*)>/,
  (match, group1) => {
    // 移除 height 和 width 属性
    const cleanedAttributes = group1.replace(/\s*(height|width)=["'][^"']*["']/g, '')
    // 返回替换后的 <svg> 标签，添加动态 height 和 width
    return `<svg${cleanedAttributes} height={heightPx} width={widthPx}>`
  }
)

const tsxContent = `
export default function SvgComponent({ height, width }: { height: number, width: number }) {
  const heightPx = height.toString() + 'px'
  const widthPx = width.toString() + 'px'
  return (
    ${modifiedSvgContent}
  )
}
`

fs.writeFileSync(outputPath, tsxContent)
console.log(`Converted ${inputPath} to ${outputPath}`)