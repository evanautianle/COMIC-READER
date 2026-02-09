import { Route, Routes } from 'react-router-dom'
import ComicDetail from './pages/ComicDetail'
import Home from './pages/Home'
import Reader from './pages/Reader'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/comic/:id" element={<ComicDetail />} />
      <Route path="/reader/:chapterId" element={<Reader />} />
    </Routes>
  )
}

export default App
