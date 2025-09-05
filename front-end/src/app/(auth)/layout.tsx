
import React from 'react'

interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({children} :AuthLayoutProps) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
      {children}
    </div>
  )
}

export default AuthLayout;



