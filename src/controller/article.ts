import { App, Context, Next, Controller, Body, Post, Use, Param, Query, Get, FormData, Cookie, Ctx } from '@node_server/index'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'

class FileUploadDto {
  title: string
  tag: string
  content: string
  summary: string
  pic: string
}

class ArticlePageDto {
  title: string
  tag: string
  content: string
  summary: string
  pic: string
}

const saveImg = (buf: Buffer) => {
  return new Promise((resolve, reject) => {
    const timestamp = (new Date().getTime() / 1000).toFixed()
    const filename = crypto.randomBytes(8).toString('hex')
    const dir = path.join(__dirname, `../../public/img/${timestamp}_${filename}.png`)
    fs.writeFile(dir, buf, (err) => {
      if(err) reject(err)
      resolve(`http://127.0.0.1:8090/views/img/${timestamp}_${filename}.png`)
    })
  })
}
@Controller('/api/article')
export class ArticleController {
  @Post('/fileUpload')
  async fileUpload(@Ctx() ctx: Context) {
    const buf = ctx.bodyBuffer
    const url = await saveImg(buf)
    return { url }
  }

  @Post('/articleUpload')
  async articleUpload(@Body() body: FileUploadDto) {
    const { title, tag, content, pic, summary } = body
    const saveFile = (buf: Buffer) => {
      return new Promise((resolve, reject) => {
        const date = new Date()
        const dir = path.join(__dirname, `../../public/${date.getFullYear()}-${date.getMonth() + 1}`)
        fs.access(dir, fs.constants.F_OK, err => {
          const fileUniqueId = crypto.randomBytes(8).toString('hex')
          if (err) {
            fs.mkdir(dir, err => {
              if (err) reject(err)
              fs.writeFile(dir + `/${title}-${fileUniqueId}.md`, buf, err => {
                if (err) reject(err)
                resolve(fileUniqueId)
              })
            })
          } else {
            fs.writeFile(dir + `/${title}-${fileUniqueId}.md`, buf, err => {
              if (err) reject(err)
              resolve(fileUniqueId)
            })
          }
        })
      })
    }
    const bufFile = Buffer.from(content, 'base64')
    const fileUniqueId = await saveFile(bufFile)
    const bufImg = Buffer.from(pic, 'base64')
    const bannerUrl = await saveImg(bufImg)
    await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8091/api/post/add',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        tagId: 1,
        uniqueId: fileUniqueId,
        title,
        summary,
        bannerUrl
      }
    })
    return {}
  }

  @Get('/:id')
  async getArticle(@Param('id') id: string, @Ctx() ctx: Context) {
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

  @Post('/page')
  async getArticlePage(@Ctx() ctx: Context) {
    ctx.proxy('http://127.0.0.1:8091/api/post/page')
  }
}