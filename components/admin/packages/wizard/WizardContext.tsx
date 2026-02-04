"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Define the shape of our Package Data
export interface WizardData {
    // Step 1: General Information
    general: {
        destination_id: number
        title: string
        slug: string
        package_category: 'normal' | 'featured' | 'group_travel' | 'offer'
        description: string
        short_description: string
        duration_days: number
        duration_nights: number
        group_size: string
        rating: number
        featured: boolean
        status: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
        // Date range
        start_date: string
        end_date: string
        // Offer fields
        is_offer: boolean
        offer_discount: number
        offer_valid_until: string
        // Provider
        provider_id: number
        // Flight info
        includes_flight: boolean
        airline_id: string
        flight_origin: string
        flight_destination: string
        // Hotel info
        hotel_id: string
        hotel_custom_name: string
        meals_plan: 'none' | 'breakfast' | 'half' | 'full' | 'all_inclusive'
        // Other
        transportation_included: boolean
        children_allowed: boolean
    }
    // Step 2: Itinerary
    itinerary: {
        day_number: number
        title: string
        description: string
        accommodation_text: string
        meals_included: string[]
        included_activities: string[]
        optional_activities: string[]
        notes: string
    }[]
    // Step 3: Inclusions & Exclusions
    inclusions: string[]
    exclusions: string[]
    tours_included: string[]
    tags: string[]
    // Step 4: Media
    media: {
        id?: string
        url: string
        type: 'IMAGE' | 'VIDEO'
        is_cover: boolean
        alt_text: string
        caption: string
    }[]
    images: string[]  // Legacy support
    // Step 5: Prices (with occupancy selection)
    pricing: {
        season_id: string
        occupancy_code: string // SGL, DBL, TPL, CPL, CHILD, INFANT
        currency_code: string
        price: number
        cost: number
        is_active: boolean
    }[]
    // Legacy price fields (for compatibility)
    price: number
    price_single: number
    price_double: number
    price_triple: number
    price_child: number
    currency_code: string
    // Step 6: Availability
    availability: {
        date: string
        capacity: number
        status: 'OPEN' | 'CLOSED'
    }[]
    available_dates: string[]  // Legacy support
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
        destination_id: 0,
        title: "",
        slug: "",
        package_category: "normal",
        description: "",
        short_description: "",
        duration_days: 1,
        duration_nights: 0,
        group_size: "",
        rating: 0,
        featured: false,
        status: "DRAFT",
        start_date: "",
        end_date: "",
        is_offer: false,
        offer_discount: 0,
        offer_valid_until: "",
        provider_id: 0,
        includes_flight: false,
        airline_id: "",
        flight_origin: "",
        flight_destination: "",
        hotel_id: "",
        hotel_custom_name: "",
        meals_plan: "none",
        transportation_included: false,
        children_allowed: true
    },
    itinerary: [],
    inclusions: [],
    exclusions: [],
    tours_included: [],
    tags: [],
    media: [],
    images: [],
    pricing: [],
    price: 0,
    price_single: 0,
    price_double: 0,
    price_triple: 0,
    price_child: 0,
    currency_code: "MXN",
    availability: [],
    available_dates: []
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

        try {
            const response = await fetch('/api/admin/packages', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data.general,
                    includes: data.inclusions,
                    excludes: data.exclusions,
                    images: data.images,
                    tags: data.tags,
                    available_dates: data.available_dates,
                    tours_included: data.tours_included,
                    price: data.price,
                    price_single: data.price_single,
                    price_double: data.price_double,
                    price_triple: data.price_triple,
                    price_child: data.price_child,
                    currency_code: data.currency_code,
                }),
            })

            if (!response.ok) {
                throw new Error("Error al guardar")
            }

            const result = await response.json()
            console.log("Package saved:", result)
        } catch (error) {
            console.error("Error saving package:", error)
            throw error
        }
    }

    const publish = async () => {
        // Set status to ACTIVE before publishing
        updateData('general', { ...data.general, status: 'ACTIVE' })
        await saveDraft()
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
