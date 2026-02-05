"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { PackagePDF } from "./PackagePDF"

interface PackagePDFExportProps {
    data: any
    fileName: string
}

const PackagePDFExport = ({ data, fileName }: PackagePDFExportProps) => {
    return (
        <PDFDownloadLink
            document={<PackagePDF data={data} />}
            fileName={fileName}
        >
            {({ loading }) => (
                <Button variant="outline" disabled={loading} className="gap-2">
                    <FileDown className="w-4 h-4" />
                    {loading ? 'Generando...' : 'Exportar PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    )
}

export default PackagePDFExport
