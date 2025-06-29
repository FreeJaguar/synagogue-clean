import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ID של קרית מלאכי ב-Hebcal API
const KIRYAT_MALAKHI_GEONAMEID = '294117'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // נסה לטעון מהמסד נתונים תחילה
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let shabbatTimes = await prisma.shabbatTimes.findFirst({
        where: {
          date: {
            gte: today