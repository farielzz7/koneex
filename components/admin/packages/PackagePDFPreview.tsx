"use client"
import React from "react"
import { PDFViewer } from "@react-pdf/renderer"
import { PackagePDF } from "./PackagePDF"

interface PackagePDFPreviewProps {
    data: any
}

const PackagePDFPreview = ({ data }: PackagePDFPreviewProps) => {
    return (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-900 p-4">
            <PDFViewer width="100%" height="100%" className="rounded-lg border shadow-sm">
                <PackagePDF data={data} />
            </PDFViewer>
        </div>
    )
}

export default PackagePDFPreview
