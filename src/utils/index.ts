import path from 'node:path'
import { promises as fs } from 'node:fs'
import yaml from 'yaml'
import { globby } from 'globby'


const contentDir = path.join(process.cwd(), 'content')
const contentFilePattern = path.join(contentDir, '*.yaml')

export const toTitleCase = (str: string) => str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
)

const getFilename = (pathname) => path.basename(pathname, path.extname(pathname))

export const getIntroData = async() => {
    const data = {}
    const contentFilePaths = await globby([ contentFilePattern ])
    if(contentFilePaths.length) {
        const files = contentFilePaths.map(async(filePath) => await fs.readFile(filePath, 'utf8'))
        let i = 0
        for await (let file of files){
            data[getFilename(contentFilePaths[i])] = yaml.parse(file)
            i++
        }
    }
    return data
}
