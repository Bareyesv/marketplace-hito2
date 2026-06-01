import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'
import { useApp, ACTIONS } from '../../context/AppContext'
import './Notification.css'

const ICONS = {
  success: <FiCheckCircle />,
  error: <FiAlertCircle />,
  warning: <FiAlertCircle />,
  info: <FiInfo />,
}

export default function Notification() {
  const { state, dispatch } = useApp()
  const { notification } = state
  if (!notification) return null

  return (
    <div className={`notification notification--${notification.type}`}>
      <span className="notif-icon">{ICONS[notification.type]}</span>
      <span className="notif-message">{notification.message}</span>
      <button className="notif-close" onClick={() => dispatch({ type: ACTIONS.CLEAR_NOTIFICATION })}>
        <FiX />
      </button>
    </div>
  )
}
