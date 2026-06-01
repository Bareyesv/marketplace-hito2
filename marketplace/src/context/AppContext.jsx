import { createContext, useContext, useReducer, useEffect } from 'react'

// =====================
// INITIAL STATE
// =====================
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  posts: [],
  favorites: [],
  categories: [],
  searchQuery: '',
  selectedCategory: null,
  cartItems: [],
  notification: null,
}

// =====================
// ACTION TYPES
// =====================
export const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_POSTS: 'SET_POSTS',
  ADD_POST: 'ADD_POST',
  SET_FAVORITES: 'SET_FAVORITES',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_SEARCH: 'SET_SEARCH',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QTY: 'UPDATE_CART_QTY',
  CLEAR_CART: 'CLEAR_CART',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  UPDATE_USER: 'UPDATE_USER',
}

// =====================
// REDUCER
// =====================
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      }
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        favorites: [],
      }
    case ACTIONS.SET_POSTS:
      return { ...state, posts: action.payload }
    case ACTIONS.ADD_POST:
      return { ...state, posts: [action.payload, ...state.posts] }
    case ACTIONS.SET_FAVORITES:
      return { ...state, favorites: action.payload }
    case ACTIONS.TOGGLE_FAVORITE: {
      const postId = action.payload
      const isFav = state.favorites.includes(postId)
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(id => id !== postId)
          : [...state.favorites, postId],
      }
    }
    case ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload }
    case ACTIONS.SET_SEARCH:
      return { ...state, searchQuery: action.payload }
    case ACTIONS.SET_CATEGORY:
      return { ...state, selectedCategory: action.payload }
    case ACTIONS.SET_NOTIFICATION:
      return { ...state, notification: action.payload }
    case ACTIONS.CLEAR_NOTIFICATION:
      return { ...state, notification: null }
    case ACTIONS.ADD_TO_CART: {
      const item = action.payload
      const existing = state.cartItems.find(i => i.id === item.id)
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, cartItems: [...state.cartItems, { ...item, quantity: 1 }] }
    }
    case ACTIONS.REMOVE_FROM_CART:
      return { ...state, cartItems: state.cartItems.filter(i => i.id !== action.payload) }
    case ACTIONS.UPDATE_CART_QTY: {
      const { id, quantity } = action.payload
      if (quantity < 1) {
        return { ...state, cartItems: state.cartItems.filter(i => i.id !== id) }
      }
      return {
        ...state,
        cartItems: state.cartItems.map(i => i.id === id ? { ...i, quantity } : i),
      }
    }
    case ACTIONS.CLEAR_CART:
      return { ...state, cartItems: [] }
    case ACTIONS.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(p => p.id === action.payload.id ? action.payload : p),
      }
    case ACTIONS.DELETE_POST:
      return { ...state, posts: state.posts.filter(p => p.id !== action.payload) }
    case ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

// =====================
// CONTEXT
// =====================
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const token = localStorage.getItem('mp_token')
    const user = localStorage.getItem('mp_user')
    const cart = localStorage.getItem('mp_cart')
    return {
      ...init,
      ...(token && user ? { token, user: JSON.parse(user), isAuthenticated: true } : {}),
      cartItems: cart ? JSON.parse(cart) : [],
    }
  })

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('mp_token', state.token)
      localStorage.setItem('mp_user', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('mp_token')
      localStorage.removeItem('mp_user')
    }
  }, [state.token, state.user])

  useEffect(() => {
    localStorage.setItem('mp_cart', JSON.stringify(state.cartItems))
  }, [state.cartItems])

  // Auto-dismiss notifications
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION }), 3500)
      return () => clearTimeout(timer)
    }
  }, [state.notification])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// =====================
// CUSTOM HOOK
// =====================
export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
