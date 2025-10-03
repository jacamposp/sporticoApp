import { Settings, User, DoorClosed, HelpCircle, ChevronRight } from 'lucide-react'

const menuOptions = [
  {
    icon: Settings,
    title: 'Configuración de la cuenta',
    href: '/profile/settings',
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
    href: '/login',
  },
]

const MenuOptions = () => {
  return (
    <div className="flex flex-col gap-7">
      {menuOptions.map((option) => (
        <div key={option.title} className="flex flex-row gap-3">
          <option.icon className="size-5" strokeWidth={2} />
          <h2>{option.title}</h2>
          <ChevronRight className="size-6 ml-auto" strokeWidth={1.5} />
        </div>
      ))}
    </div>
  )
}

export default MenuOptions
