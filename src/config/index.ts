import * as dotenv from 'dotenv'

dotenv.config()

interface Config {
  name: string
  password: string
  username: string
  avatar: string
  goServer: string
  nodeServer: string
} 

const config: Config = {
  name: process.env.NAME,
  password: process.env.PASSWORD,
  username: process.env.USERNAME,
  avatar: process.env.AVATAR,
  goServer: process.env.GO_SERVER,
  nodeServer: process.env.NODE_SERVER,
}
export default config