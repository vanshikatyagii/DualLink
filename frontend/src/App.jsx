import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SharerPortal from "./pages/SharerPortal"
import ReceiverPortal from "./pages/ReceiverPortal"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sharer" element={<SharerPortal />} />
        <Route path="/receiver" element={<ReceiverPortal />} />
      </Routes>
    </Router>
  )
}

export default App
