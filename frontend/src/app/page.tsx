import NoteInput from '@/components/NoteInput'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <h1 className = "text-3xl font-bold mb-8">Alpaca Health</h1>
      <NoteInput />
    </div>
  )
}