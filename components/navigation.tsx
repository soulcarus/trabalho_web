import Link from "next/link"

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold text-gray-900">
              Auxílio Emergencial UFC
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/solicitacao" className="text-gray-700 hover:text-gray-900">
              Nova Solicitação
            </Link>
            <Link href="/dashboard/estudante" className="text-gray-700 hover:text-gray-900">
              Dashboard Estudante
            </Link>
            <Link href="/dashboard/admin" className="text-gray-700 hover:text-gray-900">
              Painel Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

