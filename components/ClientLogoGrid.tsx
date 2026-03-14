import type React from "react"
import Container from "./ui/Container"

interface ClientLogoGridProps {
  clients: Array<{
    name: string
    logo: string
  }>
}

const ClientLogoGrid: React.FC<ClientLogoGridProps> = ({ clients }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {clients.map((client) => (
        <Container key={client.name} variant="ghost" className="p-6 flex items-center justify-center min-h-32">
          <div className="text-center">
            <img
              src={client.logo || "/placeholder.svg"}
              alt={client.name}
              className="w-12 h-12 mx-auto mb-2 grayscale opacity-70"
            />
            <p className="font-mono text-xs text-secondary text-center">{client.name}</p>
          </div>
        </Container>
      ))}
    </div>
  )
}

export default ClientLogoGrid
