import { actions } from '@/data/actions'
import { LogOut } from 'lucide-react'


export default function LogoutButton() {
  return (
    <form action={actions.auth.logoutUserAction}>
        <button type="submit" title="로그아웃">
            <LogOut className='w-6 h-6 hover:text-primary cursor-pointer m-3' aria-label="로그아웃" />
        </button>      
    </form>
  )
}
