import { getAppiToken } from '../../utils/appi_session'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const token = getAppiToken(event)
  const endpoint = String(event.node.req.url).replace('/api/appi', '')
  const contentType = getHeader(event, 'content-type') ?? ''
  // Los archivos (multipart) se reenvían tal cual, con su boundary
  const isMultipart = contentType.startsWith('multipart/form-data')
  const body = isMultipart ? await readRawBody(event, false) : await readBody(event)
  const headers: Record<string, string> = {
    'Content-Type': isMultipart ? contentType : 'application/json',
    'x-site-id': String(runtimeConfig.appiSiteId),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await $fetch(`${runtimeConfig.appi}${endpoint}`, {
    method: 'POST',
    headers,
    body,
  })
  return res
})
