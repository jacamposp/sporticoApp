'use client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Settings, User, DoorClosed, HelpCircle, ChevronRight } from 'lucide-react'

const menuOptions = [
  {
    icon: Settings,
    title: 'Configuración de la cuenta',
    href: '/profile/account-settings',
  },
  {
    icon: User,
    title: 'Ver perfil',
    href: '/profile',
  },
  {
    icon: HelpCircle,
    title: 'Obtener ayuda',
    href: '/profile/help',
  },
  {
    icon: DoorClosed,
    title: 'Cerrar sesión',
    href: '/',
    isLogout: true,
  },
]

const MenuOptions = () => {
  const router = useRouter()

  const handleClick = (option: (typeof menuOptions)[number]) => {
    if (option.isLogout) {
      signOut({ callbackUrl: '/' })
    } else {
      router.push(option.href)
    }
  }
  return (
    <div className="flex flex-col gap-7">
      {menuOptions.map((option) => (
        <a key={option.title} className="flex flex-row gap-3" onClick={() => handleClick(option)}>
          <option.icon className="size-5" strokeWidth={2} />
          <span>{option.title}</span>
          <ChevronRight className="size-6 ml-auto" strokeWidth={1.5} />
        </a>
      ))}
    </div>
  )
}

export default MenuOptions
