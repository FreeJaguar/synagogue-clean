const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 התחלת התקנה ראשונית...')

  try {
    // יצירת משתמשי ברירת מחדל
    console.log('👥 יוצר משתמשים...')
    
    const hashedPassword1 = await bcrypt.hash('password123', 12)
    const hashedPassword2 = await bcrypt.hash('password456', 12)

    await prisma.user.upsert({
      where: { username: 'גבאי1' },
      update: {},
      create: {
        username: 'גבאי1',
        password: hashedPassword1,
        role: 'gabbai'
      }
    })

    await prisma.user.upsert({
      where: { username: 'גבאי2' },
      update: {},
      create: {
        username: 'גבאי2',
        password: hashedPassword2,
        role: 'gabbai'
      }
    })

    console.log('✅ משתמשים נוצרו בהצלחה!')

    // יצירת נתוני דוגמה
    console.log('📚 יוצר נתוני דוגמה...')

    // שיעור דוגמה
    await prisma.lesson.create({
      data: {
        title: 'שיעור בגמרא',
        time: '08:00',
        rabbi: 'הרב כהן',
        date: new Date(),
        recurring: true,
        description: 'שיעור יומי בגמרא ברכות'
      }
    })

    // אזכרה דוגמה
    await prisma.memorial.create({
      data: {
        name: 'יוסף בן שרה',
        years: 25,
        date: new Date(),
        note: 'זכרונו לברכה'
      }
    })

    // דבר תורה דוגמה
    await prisma.torahWord.create({
      data: {
        content: 'זכור את יום השבת לקדשו - השבת היא מתנה יקרה שניתנה לעם ישראל',
        author: 'הרב דוד',
        date: new Date()
      }
    })

    // זמני תפילה ברירת מחדל
    await prisma.prayerTimes.create({
      data: {
        shacharit: '08:00',
        mincha: '19:00',
        mariv: '20:30',
        date: new Date()
      }
    })

    console.log('✅ נתוני דוגמה נוצרו בהצלחה!')

    console.log(`
🎉 ההתקנה הושלמה בהצלחה!

👤 פרטי התחברות:
   גבאי1: password123
   גבאי2: password456

🌐 כתובות:
   תצוגה ציבורית: http://localhost:3000
   ממשק ניהול: http://localhost:3000/admin

🚀 להפעלה:
   npm run dev
    `)

  } catch (error) {
    console.error('❌ שגיאה בהתקנה:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })