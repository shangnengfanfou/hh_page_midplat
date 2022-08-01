import { App, Context, Next, Controller, Body, Post, Use, Param, Query, Get, FormData, Cookie, Ctx } from '@node_server/index'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import config  from '../config'

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
      resolve(`${config.nodeServer}/views/img/${timestamp}_${filename}.png`)
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
      url: `${config.goServer}/api/post/add`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        tagId: parseInt(body.tag),
        uniqueId: fileUniqueId,
        title,
        summary,
        bannerUrl
      }
    })
    return {}
  }

  @Post('/page')
  async getArticlePage(@Ctx() ctx: Context) {
    ctx.proxy(`${config.goServer}/api/post/page`)
  }

  @Get('/info')
  async getArticleInfo(@Ctx() ctx: Context) {
    ctx.proxy(`${config.goServer}/api/post/info`)
  }
  
  @Get('/:id')
  async getArticle(@Param('id') id: string, @Ctx() ctx: Context, @Query('filename') filename: string, @Query('time') time: string) {
    const getPage = (id: string, filename: string, time: string): Promise<Buffer> => {
      return new Promise((resolve, reject) => {
        filename = filename.split('.').shift()
        const dir = path.join(__dirname, `../../public/${time}/${filename}-${id}.md`)
        fs.readFile(dir, (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
      })
    }
    const buf =  await getPage(id, filename, time)
    await axios({
      method: 'GET',
      url: `${config.goServer}/api/post/view/${id}`
    })
    return {
      content: buf.toString('base64')
    }
  }
}