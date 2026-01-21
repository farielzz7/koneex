"use client"

import { useWizard } from "../WizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

// Mock Data - In real app fetch from DB
const SEASONS = [
    { id: '1', name: 'Temporada Regular 2026' },
    { id: '2', name: 'Semana Santa 2026' },
]

const OCCUPANCIES = [
    { code: 'SGL', name: 'Sencilla' },
    { code: 'DBL', name: 'Doble' },
    { code: 'TPL', name: 'Triple' },
    { code: 'CHILD', name: 'Menor' },
]

export function Step5Prices() {
    const { data, updateData } = useWizard()
    const { pricing } = data

    // Helper to find existing price or return default
    const getPrice = (seasonId: string, occCode: string) => {
        return pricing.find(p => p.season_id === seasonId && p.occupancy_code === occCode) || {
            price: 0,
            cost: 0,
            currency_code: 'MXN'
        }
    }

    const handlePriceChange = (seasonId: string, occCode: string, field: 'price' | 'cost' | 'currency_code', value: any) => {
        // Remove existing entry if exists and add updated one
        const filtered = pricing.filter(p => !(p.season_id === seasonId && p.occupancy_code === occCode))

        const current = getPrice(seasonId, occCode)
        const updated = {
            ...current,
            season_id: seasonId,
            occupancy_code: occCode,
            [field]: value
        }

        // Only add if it has some meaningful data to save db space? Or typically just save all.
        // For this UI, let's keep all valid entries.
        updateData('pricing', [...filtered, updated])
    }

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Tarifas por Temporada</h2>
                <p className="text-muted-foreground">Configura los precios de venta según la temporada y ocupación.</p>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Estrategia de Precios</AlertTitle>
                <AlertDescription className="text-blue-700">
                    Los precios se configuran por persona. Si el paquete no aplica para cierta ocupación (ej. Triple),
                    deja el precio en 0.
                </AlertDescription>
            </Alert>

            {SEASONS.map(season => (
                <Card key={season.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/40 pb-4">
                        <CardTitle className="text-lg flex justify-between">
                            {season.name}
                            <span className="text-xs font-normal bg-background px-2 py-1 rounded border">Vigente</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">Ocupación</TableHead>
                                    <TableHead>Moneda</TableHead>
                                    <TableHead>Costo Neto (Interno)</TableHead>
                                    <TableHead>Precio Venta (Público)</TableHead>
                                    <TableHead>Margen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {OCCUPANCIES.map(occ => {
                                    const p = getPrice(season.id, occ.code)
                                    const margin = p.price > 0 ? ((p.price - p.cost) / p.price * 100).toFixed(0) : 0

                                    return (
                                        <TableRow key={occ.code}>
                                            <TableCell className="font-medium">
                                                {occ.name}
                                                <span className="block text-xs text-muted-foreground">{occ.code}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={p.currency_code}
                                                    onValueChange={(v) => handlePriceChange(season.id, occ.code, 'currency_code', v)}
                                                >
                                                    <SelectTrigger className="w-[80px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="MXN">MXN</SelectItem>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="EUR">EUR</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={p.cost || ""}
                                                    onChange={(e) => handlePriceChange(season.id, occ.code, 'cost', parseFloat(e.target.value) || 0)}
                                                    className="w-[120px]"
                                                    placeholder="0.00"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={p.price || ""}
                                                    onChange={(e) => handlePriceChange(season.id, occ.code, 'price', parseFloat(e.target.value) || 0)}
                                                    className="w-[120px] font-bold"
                                                    placeholder="0.00"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    Number(margin) > 20 ? "text-green-600" : Number(margin) > 0 ? "text-yellow-600" : "text-gray-400"
                                                )}>
                                                    {p.price > 0 ? `${margin}%` : '-'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
