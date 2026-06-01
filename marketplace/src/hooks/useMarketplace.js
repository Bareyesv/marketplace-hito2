import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, ACTIONS } from '../context/AppContext'
import { authService, postsService, favoritesService, MOCK_POSTS, MOCK_CATEGORIES } from '../services/api'



// ========================
// useProducts Hook
// ========================
export function useProducts() {
  const { state, dispatch } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await postsService.getAll()
      dispatch({ type: ACTIONS.SET_POSTS, payload: data })
    } catch {
      // Use mock data when backend is unavailable
      dispatch({ type: ACTIONS.SET_POSTS, payload: MOCK_POSTS })
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: MOCK_CATEGORIES })
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (state.posts.length === 0) fetchPosts()
    if (state.categories.length === 0) {
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: MOCK_CATEGORIES })
    }
  }, [])

  // Filtered posts based on search + category
  const filteredPosts = state.posts.filter((post) => {
    const matchSearch = post.titulo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      post.descripcion.toLowerCase().includes(state.searchQuery.toLowerCase())
    const matchCategory = !state.selectedCategory || post.category_id === state.selectedCategory
    return matchSearch && matchCategory
  })

  return { posts: filteredPosts, allPosts: state.posts, loading, error, refetch: fetchPosts }
}

// ========================
// useAuth Hook
// ========================
export function useAuth() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(credentials)
      dispatch({ type: ACTIONS.LOGIN, payload: { user: data.user, token: data.token } })
      dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'success', message: `¡Bienvenido, ${data.user.nombre}!` } })
      navigate('/tienda')
    } catch (err) {
      // Demo fallback
      if (credentials.email && credentials.password) {
        const mockUser = { id: 1, nombre: 'Usuario Demo', email: credentials.email }
        dispatch({ type: ACTIONS.LOGIN, payload: { user: mockUser, token: 'mock_token_demo' } })
        dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'success', message: `¡Bienvenido, ${mockUser.nombre}!` } })
        navigate('/tienda')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      await authService.register(userData)
      dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'success', message: 'Cuenta creada. ¡Ahora inicia sesión!' } })
      navigate('/login')
    } catch (err) {
      // Demo fallback
      dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'success', message: 'Cuenta creada. ¡Ahora inicia sesión!' } })
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT })
    dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'info', message: 'Sesión cerrada correctamente.' } })
    navigate('/')
  }

  return { user: state.user, isAuthenticated: state.isAuthenticated, loading, error, login, register, logout }
}

// ========================
// useFavorites Hook
// ========================
export function useFavorites() {
  const { state, dispatch } = useApp()

  const isFavorite = (postId) => state.favorites.includes(postId)

  const toggleFavorite = async (postId) => {
    if (!state.isAuthenticated) {
      dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'warning', message: 'Debes iniciar sesión para guardar favoritos.' } })
      return
    }
    dispatch({ type: ACTIONS.TOGGLE_FAVORITE, payload: postId })
    const wasFav = state.favorites.includes(postId)
    dispatch({
      type: ACTIONS.SET_NOTIFICATION,
      payload: { type: 'success', message: wasFav ? 'Eliminado de favoritos' : '¡Guardado en favoritos!' }
    })
    try {
      if (wasFav) await favoritesService.remove(postId)
      else await favoritesService.add(postId)
    } catch { /* Already updated locally, fail silently */ }
  }

  const favoritePosts = state.posts.filter(p => state.favorites.includes(p.id))

  return { favorites: state.favorites, isFavorite, toggleFavorite, favoritePosts }
}

// ========================
// useCart Hook
// ========================
export function useCart() {
  const { state, dispatch } = useApp()

  const addToCart = (post) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: post })
    dispatch({
      type: ACTIONS.SET_NOTIFICATION,
      payload: { type: 'success', message: `"${post.titulo}" agregado al carrito` },
    })
  }

  const removeFromCart = (postId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: postId })
  }

  const updateQuantity = (postId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_CART_QTY, payload: { id: postId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART })
  }

  const isInCart = (postId) => state.cartItems.some(i => i.id === postId)

  const cartTotal = state.cartItems.reduce((sum, i) => sum + i.precio * i.quantity, 0)
  const cartCount = state.cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return {
    cartItems: state.cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  }
}

// ========================
// useCreatePost Hook
// ========================
export function useCreatePost() {
  const { dispatch, state } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createPost = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const newPost = await postsService.create(formData)
      dispatch({ type: ACTIONS.ADD_POST, payload: newPost })
      dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'success', message: '¡Publicación creada exitosamente!' } })
      navigate('/perfil/publicaciones')
    } catch {
      // Demo fallback
      const mockPost = {
        id: Date.now(), ...formData,
        user_id: state.user?.id, usuario: state.user?.nombre,
      }
      dispatch({ type: ACTIONS.ADD_POST, payload: mockPost })
      dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'success', message: '¡Publicación creada exitosamente!' } })
      navigate('/perfil/publicaciones')
    } finally {
      setLoading(false)
    }
  }

  return { createPost, loading, error }
}

// ========================
// useEditPost Hook
// ========================
export function useEditPost(postId) {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const allPosts = state.posts.length ? state.posts : MOCK_POSTS
  const post = allPosts.find(p => p.id === Number(postId)) || null

  const updatePost = async (formData) => {
    setLoading(true)
    setError(null)
    const updated = { ...post, ...formData, precio: Number(formData.precio), category_id: Number(formData.category_id) }
    try {
      const data = await postsService.update(postId, updated)
      dispatch({ type: ACTIONS.UPDATE_POST, payload: data })
    } catch {
      dispatch({ type: ACTIONS.UPDATE_POST, payload: updated })
    } finally {
      dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'success', message: '¡Publicación actualizada exitosamente!' } })
      navigate('/perfil/publicaciones')
      setLoading(false)
    }
  }

  return { post, updatePost, loading, error }
}

// ========================
// useDeletePost Hook
// ========================
export function useDeletePost() {
  const { dispatch } = useApp()
  const [loadingId, setLoadingId] = useState(null)

  const deletePost = async (postId) => {
    setLoadingId(postId)
    try {
      await postsService.delete(postId)
    } catch { /* fail silently — delete locally anyway */ }
    dispatch({ type: ACTIONS.DELETE_POST, payload: postId })
    dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { type: 'success', message: 'Publicación eliminada.' } })
    setLoadingId(null)
  }

  return { deletePost, loadingId }
}
