import OssClient from 'ali-oss'
import dotenv from 'dotenv'
import fg from 'fast-glob'
import { difference } from 'lodash-es'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: '.env.oss' })
const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')

const client = new OssClient({
  bucket: process.env.OSS_BUCKET,
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_KEY,
  accessKeySecret: process.env.OSS_SECRET,
})

async function traverseOssFiles(cb) {
  let token = null
  do {
    const res = await client.listV2({ 'max-keys': '1000', 'continuation-token': token }, {})
    const keys = res.objects.map(o => o.name)
    console.log('keys', keys)
    if (!keys.length) return
    await cb(keys)
    token = res.nextContinuationToken
  } while (token)
}

async function uploadFiles() {
  const buildFiles = fg.sync(dir + '/**')
  const keys = buildFiles.map(f => f.replace(new RegExp(`^${dir}/`), ''))
  await Promise.all(keys.map(k => client.put(k, `${dir}/${k}`)))
  return keys
}

const uploaded = await uploadFiles()
console.log('uploaded', uploaded)
traverseOssFiles(async function (keys = []) {
  const arrToDel = difference(keys, uploaded)
  if (!arrToDel.length) return
  await client.deleteMulti(arrToDel)
})
