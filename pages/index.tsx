import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Flame, BookOpen, Heart, Calendar } from 'lucide-react'
import useSWR from 'swr'

// טיפוסים
interface ShabbatTimes {
  candleLighting: string
  shabbatEnds: string
  parsha: string
}

interface Lesson {
  id: string
  title: string
  time: string
  rabbi: string
  imageUrl?: string
}

interface Memorial {
  id: string
  name: string
  years: number
  imageUrl?: string
}

interface TorahWord {
  id: string
  content: string
  author: string
  imageUrl?: string
}

interface Announcement {
  id: string
  title: string
  content: string
  priority: number
  imageUrl?: string
}

// פונקציית טעינת נתונים
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// קומפוננטת נרות שבת מונפשת
const ShabbatCandles = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="flex space-x-4">
        {[1, 2].map((candle) => (
          <motion.div
            key={candle}
            className="relative"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: candle * 0.3,
            }}
          >
            {/* הנר */}
            <div className="w-4 h-16 bg-gradient-to-t from-yellow-100 to-yellow-50 rounded-t-lg shadow-lg"></div>
            
            {/* הלהבה */}
            <motion.div
              className="absolute -top-3 left-1/2 transform -translate-x-1/2"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-3 h-6 bg-gradient-to-t from-orange-400 via-yellow-400 to-yellow-200 rounded-full opacity-90 shadow-lg shadow-orange-300"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-gradient-to-t from-blue-400 to-transparent rounded-full opacity-70"></div>
            </motion.div>
            
            {/* זוהר */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// קומפוננטת שעון דיגיטלי
const DigitalClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="text-4xl font-bold text-gold-400 font-mono"
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {time.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
    </motion.div>
  )
}

// קומפוננטת כרטיס תוכן
const ContentCard = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-gold-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-400/10"
    >
      {children}
    </motion.div>
  )
}

export default function DisplayPage() {
  // טעינת נתונים עם SWR
  const { data: shabbatTimes } = useSWR<ShabbatTimes>('/api/shabbat-times', fetcher, {
    refreshInterval: 60000, // רענון כל דקה
  })
  
  const { data: lessons } = useSWR<Lesson[]>('/api/lessons', fetcher, {
    refreshInterval: 30000,
  })
  
  const { data: memorials } = useSWR<Memorial[]>('/api/memorials', fetcher, {
    refreshInterval: 30000,
  })
  
  const { data: torahWords } = useSWR<TorahWord[]>('/api/torah-words', fetcher, {
    refreshInterval: 30000,
  })
  
  const { data: announcements } = useSWR<Announcement[]>('/api/announcements', fetcher, {
    refreshInterval: 30000,
  })

  // נתונים ברירת מחדל
  const defaultShabbatTimes: ShabbatTimes = {
    candleLighting: '19:12',
    shabbatEnds: '20:25',
    parsha: 'קורח'
  }

  const currentShabbatTimes = shabbatTimes || defaultShabbatTimes

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* רקע מונפש */}
      <div className="absolute inset-0 bg-[url('/images/synagogue-pattern.png')] opacity-5"></div>
      
      {/* שעון עליון */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gold-400/30">
          <DigitalClock />
        </div>
      </div>

      {/* כותרת ראשית */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center pt-8 pb-6"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-gold-400 to-yellow-300 bg-clip-text text-transparent mb-2">
          בית כנסת אור התורה
        </h1>
        <p className="text-2xl text-blue-200">קרית מלאכי</p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6 px-8 pb-8">
        {/* עמודה שמאלית - זמני שבת */}
        <div className="col-span-4 space-y-6">
          {/* פרשת השבוע */}
          <ContentCard>
            <div className="text-center">
              <motion.div
                className="flex items-center justify-center mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BookOpen className="w-12 h-12 text-gold-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gold-400 mb-2">פרשת השבוע</h2>
              <p className="text-4xl font-bold">{currentShabbatTimes.parsha}</p>
            </div>
          </ContentCard>

          {/* הדלקת נרות */}
          <ContentCard delay={0.2}>
            <div className="text-center">
              <div className="mb-4">
                <ShabbatCandles />
              </div>
              <h3 className="text-2xl font-bold text-gold-400 mb-2">הדלקת נרות</h3>
              <p className="text-3xl font-bold">{currentShabbatTimes.candleLighting}</p>
            </div>
          </ContentCard>

          {/* יציאת שבת */}
          <ContentCard delay={0.4}>
            <div className="text-center">
              <motion.div
                className="flex items-center justify-center mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Clock className="w-10 h-10 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-blue-400 mb-2">יציאת שבת</h3>
              <p className="text-3xl font-bold">{currentShabbatTimes.shabbatEnds}</p>
            </div>
          </ContentCard>
        </div>

        {/* עמודה מרכזית - תוכן עיקרי */}
        <div className="col-span-8 space-y-6">
          {/* הודעות חשובות */}
          {announcements && announcements.length > 0 && (
            <ContentCard>
              <h2 className="text-3xl font-bold text-red-400 mb-4 flex items-center">
                <Calendar className="w-8 h-8 mr-3" />
                הודעות חשובות
              </h2>
              <div className="space-y-4">
                {announcements.slice(0, 2).map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`p-4 rounded-xl border-r-4 ${
                      announcement.priority === 3 
                        ? 'bg-red-500/20 border-red-400' 
                        : 'bg-blue-500/20 border-blue-400'
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                    <p className="text-lg">{announcement.content}</p>
                  </motion.div>
                ))}
              </div>
            </ContentCard>
          )}

          {/* שיעורים */}
          {lessons && lessons.length > 0 && (
            <ContentCard delay={0.3}>
              <h2 className="text-3xl font-bold text-green-400 mb-4 flex items-center">
                <BookOpen className="w-8 h-8 mr-3" />
                שיעורי תורה
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {lessons.slice(0, 4).map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-green-500/20 p-4 rounded-xl border border-green-400/30"
                  >
                    <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                    <p className="text-lg mb-1">⏰ {lesson.time}</p>
                    <p className="text-lg">👨‍🏫 {lesson.rabbi}</p>
                  </motion.div>
                ))}
              </div>
            </ContentCard>
          )}

          {/* אזכרות */}
          {memorials && memorials.length > 0 && (
            <ContentCard delay={0.5}>
              <h2 className="text-3xl font-bold text-purple-400 mb-4 flex items-center">
                <Heart className="w-8 h-8 mr-3" />
                לזכר הנפטרים
              </h2>
              <div className="space-y-3">
                {memorials.slice(0, 3).map((memorial, index) => (
                  <motion.div
                    key={memorial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30 text-center"
                  >
                    <h3 className="text-xl font-bold mb-1">{memorial.name}</h3>
                    <p className="text-lg">🕯️ {memorial.years} שנה</p>
                  </motion.div>
                ))}
              </div>
            </ContentCard>
          )}

          {/* דברי תורה */}
          {torahWords && torahWords.length > 0 && (
            <ContentCard delay={0.7}>
              <h2 className="text-3xl font-bold text-gold-400 mb-4 flex items-center">
                <BookOpen className="w-8 h-8 mr-3" />
                דבר תורה לשבת
              </h2>
              {torahWords.slice(0, 1).map((word) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gold-500/20 p-6 rounded-xl border border-gold-400/30"
                >
                  <p className="text-xl leading-relaxed mb-4 font-medium">
                    "{word.content}"
                  </p>
                  <p className="text-lg text-gold-300 text-left">- {word.author}</p>
                </motion.div>
              ))}
            </ContentCard>
          )}
        </div>
      </div>

      {/* כניסה למצב ניהול (מוסתר) */}
      <button
        onClick={() => window.location.href = '/admin'}
        className="fixed bottom-4 right-4 w-4 h-4 opacity-0 hover:opacity-100 transition-opacity"
        title="ניהול"
      >
        ⚙️
      </button>
    </div>
  )
}