"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Define the shape of our Package Data based on the 3-Worlds Model
export interface WizardData {
    // Step 1: General
    general: {
        title: string
        slug: string
        destination_id: string
        description: string
        duration_days: number
        duration_nights: number
    }
    // Step 2: Itinerary
    itinerary: {
        day_number: number
        title: string
        items: {
            time: string
            title: string
            description: string
        }[]
    }[]
    // Step 3: Inclusions
    inclusions: string[]
    exclusions: string[]
    // Step 4: Media
    media: {
        id?: string
        url: string
        type: 'IMAGE' | 'VIDEO'
        is_cover: boolean
    }[]
    // Step 5: Prices (Complex Matrix)
    pricing: {
        season_id: string
        occupancy_code: string // SGL, DBL
        currency_code: string
        price: number
        cost: number
    }[]
    // Step 6: Availability
    availability: {
        date: Date
        capacity: number
        status: 'OPEN' | 'CLOSED'
    }[]
}

interface WizardContextType {
    currentStep: number
    data: WizardData
    setStep: (step: number) => void
    updateData: (section: keyof WizardData, payload: any) => void
    saveDraft: () => Promise<void>
    publish: () => Promise<void>
}

const defaultData: WizardData = {
    general: {
        title: "",
        slug: "",
        destination_id: "",
        description: "",
        duration_days: 1,
        duration_nights: 0
    },
    itinerary: [],
    inclusions: [],
    exclusions: [],
    media: [],
    pricing: [],
    availability: []
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: ReactNode }) {
    const [currentStep, setStep] = useState(1)
    const [data, setData] = useState<WizardData>(defaultData)

    const updateData = (section: keyof WizardData, payload: any) => {
        setData(prev => ({
            ...prev,
            [section]: payload
        }))
    }

    const saveDraft = async () => {
        // TODO: Call API to save as DRAFT
        console.log("Saving Draft", data)
    }

    const publish = async () => {
        // TODO: Call API to save and set status ACTIVE
        console.log("Publishing", data)
    }

    return (
        <WizardContext.Provider value={{
            currentStep,
            data,
            setStep,
            updateData,
            saveDraft,
            publish
        }}>
            {children}
        </WizardContext.Provider>
    )
}

export function useWizard() {
    const context = useContext(WizardContext)
    if (!context) throw new Error("useWizard must be used within WizardProvider")
    return context
}
