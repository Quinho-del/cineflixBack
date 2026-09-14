import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Filmes from "./pages/Filmes"
import MovieDetail from "./pages/MovieDetail"
import Sobre from "./pages/Sobre"
import Contato from "./pages/Contato"
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import AdminMovies from "./pages/AdminMovies"
import MovieForm from "./pages/MovieForm"
import AdminCategories from "./pages/AdminCategories"
import useAuthStore from "./store/authStore"
import useFavoritesStore from "./store/favoritesStore"

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const fetchIds = useFavoritesStore((s) => s.fetchIds)

  useEffect(() => {
    if (isAuthenticated()) {
      fetchIds()
    }
  }, [isAuthenticated, fetchIds])

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filmes" element={<Filmes />} />
            <Route path="/filmes/:id" element={<MovieDetail />} />
            <Route
              path="/favoritos"
              element={
                <ProtectedRoute>
                  <Filmes onlyFavorites />
                </ProtectedRoute>
              }
            />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route
              path="/admin/filmes"
              element={
                <ProtectedRoute adminOnly>
                  <AdminMovies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/filmes/novo"
              element={
                <ProtectedRoute adminOnly>
                  <MovieForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/filmes/:id/editar"
              element={
                <ProtectedRoute adminOnly>
                  <MovieForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categorias"
              element={
                <ProtectedRoute adminOnly>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
