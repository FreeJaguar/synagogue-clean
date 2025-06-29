import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const lessons = await prisma.lesson.findMany({
        orderBy: [
          { date: 'asc' },
          { time: 'asc' }
        ]
      })
      
      res.status(200).json(lessons)
    } catch (error) {
      console.error('Error fetching lessons:', error)
      res.status(500).json({ error: 'Failed to fetch lessons' })
    }
  } 
  
  else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const { title, time, rabbi, date, recurring, description, imageUrl } = req.body

      // בדיקת שדות חובה
      if (!title || !time || !rabbi || !date) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const lesson = await prisma.lesson.create({
        data: {
          title,
          time,
          rabbi,
          date: new Date(date),
          recurring: recurring || false,
          description: description || null,
          imageUrl: imageUrl || null
        }
      })

      res.status(201).json(lesson)
    } catch (error) {
      console.error('Error creating lesson:', error)
      res.status(500).json({ error: 'Failed to create lesson' })
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}