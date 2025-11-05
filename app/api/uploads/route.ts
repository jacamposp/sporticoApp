import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// POST /api/uploads
// Accepts multipart/form-data with one or more files under the key "file" or "files"
// Saves them under public/uploads and returns public URLs
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const files: File[] = []
    const single = formData.get('file')
    const many = formData.getAll('files')
    if (single instanceof File) files.push(single)
    for (const f of many) if (f instanceof File) files.push(f)

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const urls: string[] = []
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const ext = path.extname(file.name) || '.bin'
      const safeBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '') || 'file'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeBase}${ext}`
      const filePath = path.join(uploadDir, filename)
      await fs.writeFile(filePath, buffer)

      const publicUrl = `/uploads/${filename}`
      urls.push(publicUrl)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
