const glob = require('glob')
const fs = require('fs')
const path = require('path')

const excludedDirs = ['pages', 'api', 'styles', 'public']
const srcDirPath = path.join(__dirname, '../src')

function isModule(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  return content.includes('import') || content.includes('export')
}

function replaceDefaultExports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const matchedWords = content.match(/export default ([a-zA-Z0-9$_]+)/g)
  console.log(matchedWords)
  matchedWords?.map((word) => {
    let newWord = word.substring(15)
    content = content.replace(`const ${newWord}`, `export const ${newWord}`)
    content = content.replace(new RegExp(`\\s\\sexport default ${newWord}\\s*`, 'g'), '')
  })
  if (content && content.length > 1) {
    fs.writeFileSync(filePath, content)
  }
}

function generateIndex(dir) {
  const files = glob.sync('**/*.{ts,tsx}', { cwd: dir, nodir: true })

  const exports = files
    .filter((file) => isModule(path.join(dir, file)))
    .map((file) => {
      replaceDefaultExports(path.join(dir, file))
      const filePath = path.relative(dir, path.join(dir, file)).replace(/\\/g, '/')
      return `export * from './${filePath.slice(0, -path.extname(filePath).length)}'`
    })

  if (exports.length > 0) {
    const indexFile = path.join(dir, 'index.ts')
    fs.writeFileSync(indexFile, exports.join('\n') + '\n')
  }
}

function generateIndexes(dir) {
  const subdirs = glob.sync('*/', { cwd: dir })

  subdirs
    .filter((subdir) => !excludedDirs.includes(subdir.slice(0, -1)))
    .forEach((subdir) => {
      const subdirPath = path.join(dir, subdir)
      generateIndex(subdirPath)
    })
}

generateIndexes(srcDirPath)
