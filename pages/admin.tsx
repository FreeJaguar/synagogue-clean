import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Heart, 
  Clock, 
  Settings, 
  Upload, 
  Save, 
  Trash2, 
  Eye, 
  Calendar,
  Users,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast, { Toaster } from 'react-hot-toast'

// טיפוסים
interface Lesson {
  id?: string
  title: string
  time: string
  rabbi: string
  date: string
  recurring: boolean
  description?: string
  imageUrl?: string
}

interface Memorial {
  id?: string
  name: string
  years: number
  date: string
  note?: string
  imageUrl?: string
}

interface TorahWord {
  id?: string
  content: string
  author: string
  date: string
  imageUrl?: string
}

interface Announcement {
  id?: string
  title: string
  content: string
  priority: number
  imageUrl?: string
  startDate: string
  endDate?: string
}

// קומפוננטת התחברות
const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await signIn('credentials', {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      })
      
      if (result?.error) {
        toast.error('שם משתמש או סיסמה שגויים')
      } else {
        toast.success('התחברת בהצלחה!')
      }
    } catch (error) {
      toast.error('שגיאה בהתחברות')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ממשק ניהול</h1>
          <p className="text-gray-600">כניסה לגבאים בלבד</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם משתמש
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="הכנס שם משתמש"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="הכנס סיסמה"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← חזור לתצוגה הציבורית
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// קומפוננטת העלאת תמונות
const ImageUpload = ({ onImageUpload }: { onImageUpload: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const { url } = await response.json()
        onImageUpload(url)
        toast.success('התמונה הועלתה בהצלחה!')
      } else {
        toast.error('שגיאה בהעלאת התמונה')
      }
    } catch (error) {
      toast.error('שגיאה בהעלאת התמונה')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      {uploading ? (
        <p className="text-blue-600">מעלה תמונה...</p>
      ) : (
        <>
          <p className="text-gray-600 mb-2">גרור תמונה או לחץ להעלאה</p>
          <p className="text-sm text-gray-400">PNG, JPG, GIF עד 5MB</p>
        </>
      )}
    </div>
  )
}

// קומפוננטת טאב
const TabButton = ({ 
  active, 
  onClick, 
  children, 
  icon: Icon 
}: { 
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon: any
}) => (
  <button
    onClick={onClick}
    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5 mr-2" />
    {children}
  </button>
)

// קומפוננטת ניהול שיעורים
const LessonsManager = () => {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [newLesson, setNewLesson] = useState<Lesson>({
    title: '',
    time: '',
    rabbi: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    description: '',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      const data = await response.json()
      setLessons(data)
    } catch (error) {
      toast.error('שגיאה בטעינת השיעורים')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLesson)
      })

      if (response.ok) {
        toast.success('השיעור נוסף בהצלחה!')
        setNewLesson({
          title: '',
          time: '',
          rabbi: '',
          date: new Date().toISOString().split('T')[0],
          recurring: false,
          description: '',
          imageUrl: ''
        })
        fetchLessons()
      } else {
        toast.error('שגיאה בהוספת השיעור')
      }
    } catch (error) {
      toast.error('שגיאה בהוספת השיעור')
    } finally {
      setLoading(false)
    }
  }

  const deleteLesson = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את השיעור?')) return

    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('השיעור נמחק בהצלחה!')
        fetchLessons()
      } else {
        toast.error('שגיאה במחיקת השיעור')
      }
    } catch (error) {
      toast.error('שגיאה במחיקת השיעור')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">הוספת שיעור חדש</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כותרת השיעור
            </label>
            <input
              type="text"
              value={newLesson.title}
              onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="למשל: שיעור בגמרא"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שעה
            </label>
            <input
              type="time"
              value={newLesson.time}
              onChange={(e) => setNewLesson(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מגיד השיעור
            </label>
            <input
              type="text"
              value={newLesson.rabbi}
              onChange={(e) => setNewLesson(prev => ({ ...prev, rabbi: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="למשל: הרב כהן"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תאריך
            </label>
            <input
              type="date"
              value={newLesson.date}
              onChange={(e) => setNewLesson(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תיאור השיעור
            </label>
            <textarea
              value={newLesson.description}
              onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="תיאור קצר של השיעור..."
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תמונה (אופציונלי)
            </label>
            <ImageUpload 
              onImageUpload={(url) => setNewLesson(prev => ({ ...prev, imageUrl: url }))}
            />
            {newLesson.imageUrl && (
              <div className="mt-4">
                <img 
                  src={newLesson.imageUrl} 
                  alt="תמונת השיעור" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newLesson.recurring}
                onChange={(e) => setNewLesson(prev => ({ ...prev, recurring: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="mr-2 text-sm text-gray-700">שיעור קבוע (חוזר כל שבת)</span>
            </label>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5 inline mr-2" />
              {loading ? 'שומר...' : 'הוסף שיעור'}
            </button>
          </div>
        </form>
      </div>

      {/* רשימת שיעורים קיימים */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">שיעורים קיימים</h3>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{lesson.title}</h4>
                <p className="text-gray-600">
                  {lesson.time} | {lesson.rabbi} | {lesson.date}
                  {lesson.recurring && ' (קבוע)'}
                </p>
                {lesson.description && (
                  <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                {lesson.imageUrl && (
                  <img 
                    src={lesson.imageUrl} 
                    alt="תמונת השיעור" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={() => deleteLesson(lesson.id!)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// קומפוננטת ניהול אזכרות
const MemorialsManager = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [newMemorial, setNewMemorial] = useState<Memorial>({
    name: '',
    years: 0,
    date: new Date().toISOString().split('T')[0],
    note: '',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMemorials()
  }, [])

  const fetchMemorials = async () => {
    try {
      const response = await fetch('/api/memorials')
      const data = await response.json()
      setMemorials(data)
    } catch (error) {
      toast.error('שגיאה בטעינת האזכרות')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/memorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemorial)
      })

      if (response.ok) {
        toast.success('האזכרה נוספה בהצלחה!')
        setNewMemorial({
          name: '',
          years: 0,
          date: new Date().toISOString().split('T')[0],
          note: '',
          imageUrl: ''
        })
        fetchMemorials()
      } else {
        toast.error('שגיאה בהוספת האזכרה')
      }
    } catch (error) {
      toast.error('שגיאה בהוספת האזכרה')
    } finally {
      setLoading(false)
    }
  }

  const deleteMemorial = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את האזכרה?')) return

    try {
      const response = await fetch(`/api/memorials/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('האזכרה נמחקה בהצלחה!')
        fetchMemorials()
      } else {
        toast.error('שגיאה במחיקת האזכרה')
      }
    } catch (error) {
      toast.error('שגיאה במחיקת האזכרה')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">הוספת אזכרה חדשה</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם הנפטר/ת
            </label>
            <input
              type="text"
              value={newMemorial.name}
              onChange={(e) => setNewMemorial(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="למשל: יוסף בן שרה"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מספר שנים
            </label>
            <input
              type="number"
              value={newMemorial.years}
              onChange={(e) => setNewMemorial(prev => ({ ...prev, years: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="25"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תאריך
            </label>
            <input
              type="date"
              value={newMemorial.date}
              onChange={(e) => setNewMemorial(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הערה (אופציונלי)
            </label>
            <input
              type="text"
              value={newMemorial.note}
              onChange={(e) => setNewMemorial(prev => ({ ...prev, note: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="הערה נוספת..."
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תמונה (אופציונלי)
            </label>
            <ImageUpload 
              onImageUpload={(url) => setNewMemorial(prev => ({ ...prev, imageUrl: url }))}
            />
            {newMemorial.imageUrl && (
              <div className="mt-4">
                <img 
                  src={newMemorial.imageUrl} 
                  alt="תמונת הנפטר" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5 inline mr-2" />
              {loading ? 'שומר...' : 'הוסף אזכרה'}
            </button>
          </div>
        </form>
      </div>

      {/* רשימת אזכרות קיימות */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">אזכרות קיימות</h3>
        <div className="space-y-4">
          {memorials.map((memorial) => (
            <motion.div
              key={memorial.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{memorial.name}</h4>
                <p className="text-gray-600">{memorial.years} שנה | {memorial.date}</p>
                {memorial.note && (
                  <p className="text-sm text-gray-500 mt-1">{memorial.note}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                {memorial.imageUrl && (
                  <img 
                    src={memorial.imageUrl} 
                    alt="תמונת הנפטר" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={() => deleteMemorial(memorial.id!)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// קומפוננטת ראשית של הממשק
export default function AdminPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('lessons')

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    )
  }

  if (!session) {
    return <LoginForm />
  }

  const tabs = [
    { id: 'lessons', label: 'שיעורים', icon: BookOpen },
    { id: 'memorials', label: 'אזכרות', icon: Heart },
    { id: 'torah', label: 'דברי תורה', icon: BookOpen },
    { id: 'announcements', label: 'הודעות', icon: Calendar },
    { id: 'settings', label: 'הגדרות', icon: Settings },
    { id: 'stats', label: 'סטטיסטיקות', icon: BarChart3 }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* כותרת עליונה */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              ממשק ניהול - בית כנסת אור התורה
            </h1>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-5 h-5 mr-2" />
                תצוגה מקדימה
              </button>
              
              <button
                onClick={() => signOut()}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                יציאה
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* טאבים */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>
        </div>

        {/* תוכן הטאבים */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'lessons' && <LessonsManager />}
            {activeTab === 'memorials' && <MemorialsManager />}
            {activeTab === 'torah' && <div>דברי תורה - בפיתוח</div>}
            {activeTab === 'announcements' && <div>הודעות - בפיתוח</div>}
            {activeTab === 'settings' && <div>הגדרות - בפיתוח</div>}
            {activeTab === 'stats' && <div>סטטיסטיקות - בפיתוח</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}