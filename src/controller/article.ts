import { App, Context, Next, Controller, Body, Post, Use, Param, Query, Get, FormData, Cookie, Ctx } from '@node_server/index'
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

@Controller('/api/article')
export class ArticleController {
  @Post('/fileUpload')
  async fileUpload(@Ctx() ctx: Context) {
    // const bodyStream = ctx.bodyStream
    // const getData = () : Promise<Buffer> => {
    //   return new Promise((resolve, reject) => {
    //     let chunks: Buffer[] = []
    //     let size = 0
    //     bodyStream.on('data', (chunk: Buffer) => {
    //       chunks.push(chunk)
    //       size += chunk.length
    //     })
    //     bodyStream.on('end', () => {
    //       const buf = Buffer.concat(chunks)
    //       resolve(buf)
    //     })
    //     bodyStream.on('error', reject)
    //   })
    // }
    // const buf: Buffer = await getData()
    const buf = ctx.bodyBuffer
    const saveFile = (buf: Buffer) => {
      return new Promise((resolve, reject) => {
        const filename = crypto.randomBytes(8).toString('hex')
        const dir = path.join(__dirname, `../../public/img/${filename}.png`)
        fs.writeFile(dir, buf, (err) => {
          if(err) reject(err)
          resolve({
            url: `http://127.0.0.1:8090/views/img/${filename}.png`
          })
        })
      })
    }
    return await saveFile(buf)
  }
}