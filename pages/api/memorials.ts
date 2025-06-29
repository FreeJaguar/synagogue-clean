import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const memorials = await prisma.memorial.findMany({
        orderBy: { date: 'desc' }
      })
      
      res.status(200).json(memorials)
    } catch (error) {
      console.error('Error fetching memorials:', error)
      res.status(500).json({ error: 'Failed to fetch memorials' })
    }
  } 
  
  else if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const { name, years, date, note, imageUrl } = req.body

      // בדיקת שדות חובה
      if (!name || !years || !date) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const memorial = await prisma.memorial.create({
        data: {
          name,
          years: parseInt(years),
          date: new Date(date),
          note: note || null,
          imageUrl: imageUrl || null
        }
      })

      res.status(201).json(memorial)
    } catch (error) {
      console.error('Error creating memorial:', error)
      res.status(500).json({ error: 'Failed to create memorial' })
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}