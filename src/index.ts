import 'module-alias/register'
import { App, Context, Next, Controller, Body, Post, Use, Param, Query, Get, FormData, Cookie, Ctx } from '@node_server/index'
import * as path from 'path'
import './controller'

const app = new App()


app.static('views', path.join(__dirname, '../public'))

app.listen(8090)