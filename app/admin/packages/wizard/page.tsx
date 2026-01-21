"use client"

import { WizardProvider, useWizard } from "@/components/admin/packages/wizard/WizardContext"
import { WizardLayout } from "@/components/admin/packages/wizard/WizardLayout"
import { Step1General } from "@/components/admin/packages/wizard/steps/Step1General"
import { Step2Itinerary } from "@/components/admin/packages/wizard/steps/Step2Itinerary"
import { Step3Inclusions } from "@/components/admin/packages/wizard/steps/Step3Inclusions"
import { Step4Media } from "@/components/admin/packages/wizard/steps/Step4Media"
import { Step5Prices } from "@/components/admin/packages/wizard/steps/Step5Prices"
import { Step6Availability } from "@/components/admin/packages/wizard/steps/Step6Availability"

function WizardContent() {
    const { currentStep } = useWizard()

    // Step Renderer
    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1General />
            case 2: return <Step2Itinerary />
            case 3: return <Step3Inclusions />
            case 4: return <Step4Media />
            case 5: return <Step5Prices />
            case 6: return <Step6Availability />
            default: return <div>Paso desconocido</div>
        }
    }

    return (
        <WizardLayout>
            {renderStep()}
        </WizardLayout>
    )
}

export default function PackageWizardPage() {
    return (
        <WizardProvider>
            <WizardContent />
        </WizardProvider>
    )
}
