import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer.js"
import Home from "./pages/Home.js"
import SharerPage from "./pages/SharerPage.js"
import ReceiverPage from "./pages/ReceiverPage.js"

export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 pt-5 pb-4">
          <div className="container-lg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sharer" element={<SharerPage />} />
              <Route path="/receiver" element={<ReceiverPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
