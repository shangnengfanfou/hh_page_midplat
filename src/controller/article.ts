import { App, Context, Next, Controller, Body, Post, Use, Param, Query, Get, FormData, Cookie, Ctx } from '@node_server/index'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

class FileUploadDto {
  title: string
  tag: string
  content: string
}

@Controller('/api/article')
export class ArticleController {
  @Post('/fileUpload')
  async fileUpload(@Ctx() ctx: Context) {
    const buf = ctx.bodyBuffer
    const saveFile = (buf: Buffer) => {
      return new Promise((resolve, reject) => {
        const timestamp = (new Date().getTime() / 1000).toFixed()
        const filename = crypto.randomBytes(8).toString('hex')
        const dir = path.join(__dirname, `../../public/img/${timestamp}_${filename}.png`)
        fs.writeFile(dir, buf, (err) => {
          if(err) reject(err)
          resolve({
            url: `http://127.0.0.1:8090/views/img/${timestamp}_${filename}.png`
          })
        })
      })
    }
    return await saveFile(buf)
  }

  @Post('/articleUpload')
  async articleUpload(@Body() body: FileUploadDto) {
    const { title, tag, content } = body
    const saveFile = (buf: Buffer) => {
      return new Promise((resolve, reject) => {
        const date = new Date()
        const dir = path.join(__dirname, `../../public/${date.getFullYear()}-${date.getMonth() + 1}`)
        fs.access(dir, fs.constants.F_OK, err => {
          if (err) {
            fs.mkdir(dir, err => {
              if (err) reject(err)
              fs.writeFile(dir + `/${title}.md`, buf, err => {
                if (err) reject(err)
                resolve(null)
              })
            })
          } else {
            fs.writeFile(dir + `/${title}.md`, buf, err => {
              if (err) reject(err)
              resolve(null)
            })
          }
        })
      })
    }
    const buf = Buffer.from(content, 'base64')
    await saveFile(buf)
    return {}
  }

  @Get('/:id')
  async getArticlePage(@Param('id') id: string, @Ctx() ctx: Context) {
    const getPage = (id: string): Promise<Buffer> => {
      return new Promise((resolve, reject) => {
        const dir = path.join(__dirname, `../../public/2022-7/测试文2323.md`)
        fs.readFile(dir, (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
      })
    }
    const buf =  await getPage(id)
    return {
      content: buf.toString('base64')
    }
  }

}