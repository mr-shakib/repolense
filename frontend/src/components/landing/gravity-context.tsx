import { createContext, useContext, ReactNode } from "react"

interface GravityContextType {
    strength: number
    enabled: boolean
}

const GravityContext = createContext<GravityContextType>({
    strength: 1,
    enabled: true,
})

export const useGravity = () => useContext(GravityContext)

export const GravityProvider = ({ children }: { children: ReactNode }) => {
    return (
        <GravityContext.Provider value={{ strength: 1, enabled: true }}>
            {children}
        </GravityContext.Provider>
    )
}
