"use client"

import { useWizard } from "../WizardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Info, X, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock Data - In real app fetch from DB
const SEASONS = [
    { id: '1', name: 'Temporada Regular 2026' },
]

const PREDEFINED_OCCUPANCIES = [
    { code: 'SGL', name: 'Sencilla' },
    { code: 'DBL', name: 'Doble' },
    { code: 'TPL', name: 'Triple' },
    { code: 'CPL', name: 'Cuádruple' },
    { code: 'CHILD', name: 'Menor' },
    { code: 'INFANT', name: 'Infante' },
]

export function Step5Prices() {
    const { data, updateData } = useWizard()
    const { pricing } = data
    const [customOccupancies, setCustomOccupancies] = useState<{ code: string; name: string; }[]>([])
    const [newOccCode, setNewOccCode] = useState('')
    const [newOccName, setNewOccName] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // All available occupancies (predefined + custom)
    const ALL_OCCUPANCIES = [...PREDEFINED_OCCUPANCIES, ...customOccupancies]

    // Initialize default occupancies when component mounts
    useEffect(() => {
        // Only initialize if pricing is completely empty
        if (pricing.length === 0) {
            const defaultOccupancies = ['SGL', 'DBL']
            const defaultPricing = SEASONS.flatMap(season =>
                defaultOccupancies.map(occCode => ({
                    season_id: season.id,
                    occupancy_code: occCode,
                    currency_code: 'MXN',
                    price: 0,
                    cost: 0,
                    is_active: true
                }))
            )
            updateData('pricing', defaultPricing)
        }
    }, []) // Run only once on mount

    // Get selected occupancies for a specific season
    const getSelectedOccupancies = (seasonId: string) => {
        const seasonPricing = pricing.filter(p => p.season_id === seasonId)
        return seasonPricing.map(p => p.occupancy_code)
    }

    // Check if an occupancy is selected for a season
    const isOccupancySelected = (seasonId: string, occCode: string) => {
        return getSelectedOccupancies(seasonId).includes(occCode)
    }

    // Helper to find existing price or return default
    const getPrice = (seasonId: string, occCode: string) => {
        return pricing.find(p => p.season_id === seasonId && p.occupancy_code === occCode) || {
            price: 0,
            cost: 0,
            currency_code: 'MXN',
            is_active: true
        }
    }

    const handlePriceChange = (seasonId: string, occCode: string, field: 'price' | 'cost' | 'currency_code' | 'is_active', value: any) => {
        const filtered = pricing.filter(p => !(p.season_id === seasonId && p.occupancy_code === occCode))
        const current = getPrice(seasonId, occCode)

        const updated = {
            ...current,
            season_id: seasonId,
            occupancy_code: occCode,
            [field]: value
        }

        updateData('pricing', [...filtered, updated])
    }

    const handleToggleOccupancy = (seasonId: string, occCode: string) => {
        if (isOccupancySelected(seasonId, occCode)) {
            // Remove occupancy
            const filtered = pricing.filter(p => !(p.season_id === seasonId && p.occupancy_code === occCode))
            updateData('pricing', filtered)
        } else {
            // Add occupancy
            const newEntry = {
                season_id: seasonId,
                occupancy_code: occCode,
                currency_code: 'MXN',
                price: 0,
                cost: 0,
                is_active: true
            }
            updateData('pricing', [...pricing, newEntry])
        }
    }

    const handleAddCustomOccupancy = () => {
        if (newOccCode && newOccName) {
            // Check if code already exists
            if (ALL_OCCUPANCIES.some(occ => occ.code === newOccCode.toUpperCase())) {
                alert('Este código de ocupación ya existe')
                return
            }

            setCustomOccupancies([...customOccupancies, {
                code: newOccCode.toUpperCase(),
                name: newOccName
            }])
            setNewOccCode('')
            setNewOccName('')
            setIsDialogOpen(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Tarifas por Temporada</h2>
                <p className="text-muted-foreground">Selecciona los tipos de ocupación disponibles y configura sus precios.</p>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Tipos de Ocupación</AlertTitle>
                <AlertDescription className="text-blue-700">
                    Haz clic en los botones para seleccionar los tipos de ocupación que apliquen para este paquete.
                    Puedes agregar tipos personalizados si lo necesitas.
                </AlertDescription>
            </Alert>

            {SEASONS.map(season => {
                const selectedOccs = getSelectedOccupancies(season.id)

                return (
                    <Card key={season.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/40 pb-4">
                            <CardTitle className="text-lg flex justify-between items-center">
                                {season.name}
                                <span className="text-xs font-normal bg-background px-2 py-1 rounded border">Vigente</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Occupancy Selection Buttons */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Selecciona los tipos de ocupación:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_OCCUPANCIES.map(occ => {
                                        const isSelected = isOccupancySelected(season.id, occ.code)
                                        return (
                                            <Button
                                                key={occ.code}
                                                variant={isSelected ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleToggleOccupancy(season.id, occ.code)}
                                                className={cn(
                                                    "gap-2",
                                                    isSelected && "bg-primary text-primary-foreground"
                                                )}
                                            >
                                                {isSelected && <Check className="h-4 w-4" />}
                                                {occ.name}
                                                <Badge variant="secondary" className="ml-1 text-xs">
                                                    {occ.code}
                                                </Badge>
                                            </Button>
                                        )
                                    })}

                                    {/* Add Custom Occupancy Button */}
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2 border-dashed">
                                                <Plus className="h-4 w-4" />
                                                Agregar Otra
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Agregar Tipo de Ocupación Personalizado</DialogTitle>
                                                <DialogDescription>
                                                    Define un nuevo tipo de ocupación que no está en la lista predefinida.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="occ-code">Código (ej: QAD)</Label>
                                                    <Input
                                                        id="occ-code"
                                                        placeholder="QAD"
                                                        value={newOccCode}
                                                        onChange={(e) => setNewOccCode(e.target.value.toUpperCase())}
                                                        maxLength={6}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="occ-name">Nombre (ej: Quíntuple)</Label>
                                                    <Input
                                                        id="occ-name"
                                                        placeholder="Quíntuple"
                                                        value={newOccName}
                                                        onChange={(e) => setNewOccName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button onClick={handleAddCustomOccupancy} disabled={!newOccCode || !newOccName}>
                                                    Agregar
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            {/* Pricing Table - Only show if occupancies are selected */}
                            {selectedOccs.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-[150px]">Ocupación</TableHead>
                                                <TableHead>Moneda</TableHead>
                                                <TableHead>Costo Neto</TableHead>
                                                <TableHead>Precio Venta</TableHead>
                                                <TableHead>Margen</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedOccs.map(occCode => {
                                                const occ = ALL_OCCUPANCIES.find(o => o.code === occCode)!
                                                const p = getPrice(season.id, occ.code)
                                                const margin = p.price > 0 ? ((p.price - p.cost) / p.price * 100).toFixed(0) : 0

                                                return (
                                                    <TableRow key={occ.code}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline">{occ.code}</Badge>
                                                                {occ.name}
                                                            </div>
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
                                                                step="0.01"
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
                                                                step="0.01"
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
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                    Selecciona al menos un tipo de ocupación para comenzar
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
