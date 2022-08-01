import { App, Context, Next, Controller, Body, Post, Use, Param, Query, Get, FormData, Cookie, Ctx } from '@node_server/index'
import config  from '../config'
import * as crypto  from 'crypto'

class LoginDto {
  name: string
  password: string
}

@Controller('/api/user')
export class UserController {
  @Post('/login')
  async login(@Body() body: LoginDto) {
    const { name, password } = body
    if (config.name !== name || config.password !== Buffer.from(password, 'base64').toString()) {
      return { 
        code: -1,
        message: '账户名或密码错误'
      }
    }
    return {
      code: 0,
      message: `${config.username} 欢迎回来`,
      data: {
        permissions: [{id: 'queryForm', operation: ['add', 'edit']}],
        roles: [{id: 'admin', operation: ['add', 'edit', 'delete']}],
        user: {
          name: config.username,
          avatar: config.avatar,
          address: "武汉",
          position: {
            CN: "全栈工程师 | 金山办公-二次开发生态",
            HK: "全棧工程師 | 金山辦公-二次開發生態",
            US: "Full-Stack engineer | Kingsoft Office-Secondary Development Ecology"
          },
          token: 'Authorization:' + crypto.randomBytes(16).toString('hex'),
          expireAt: new Date(new Date().getTime() + 24* 60 * 60 * 1000)
        }
      }
    }
  }
  @Get('/route')
  async route() {
    return {
      code: 0,
      data: {
        router: 'root',
      }
    }
  }
}