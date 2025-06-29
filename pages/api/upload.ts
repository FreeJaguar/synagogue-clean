import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'

// הגדרת גודל מקסימלי לקובץ (5MB)
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const form = new IncomingForm({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      uploadDir: './public/uploads',
      keepExtensions: true,
    })

    // יצירת תיקיית uploads אם לא קיימת
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err)
        return res.status(500).json({ error: 'Error parsing form data' })
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      // בדיקת סוג הקובץ
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.mimetype || '')) {
        return res.status(400).json({ error: 'Invalid file type' })
      }

      try {
        // יצירת שם קובץ ייחודי
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalFilename || '')}`
        const newPath = path.join(uploadDir, fileName)
        
        // העברת הקובץ למקום הסופי
        await fs.rename(file.filepath, newPath)
        
        // החזרת URL של הקובץ
        const fileUrl = `/uploads/${fileName}`
        
        res.status(200).json({ 
          url: fileUrl,
          filename: fileName 
        })
        
      } catch (moveError) {
        console.error('Error moving file:', moveError)
        res.status(500).json({ error: 'Error saving file' })
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}