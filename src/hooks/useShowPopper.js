import { useState, useEffect } from 'react'

function useShowPopper() {
  const [shouldShowPopper, setShouldShowPopper] = useState(false);

  const handleSettingOfShouldShowPopper = () => {
    setShouldShowPopper(true)
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleSettingOfShouldShowPopper)
    document.addEventListener('keydown', handleSettingOfShouldShowPopper)
    document.addEventListener('keyup', handleSettingOfShouldShowPopper)
    return () => {
      document.removeEventListener('mouseup', handleSettingOfShouldShowPopper)
      document.removeEventListener('keydown', handleSettingOfShouldShowPopper)
      document.removeEventListener('keyup', handleSettingOfShouldShowPopper)
    }
  }, [])

  return { shouldShowPopper, setShouldShowPopper };
}

export default useShowPopper