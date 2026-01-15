/**
 * Exporta un array de objetos a un archivo CSV y activa la descarga en el navegador.
 * @param data Array de objetos con los datos a exportar
 * @param filename Nombre del archivo (sin extensión)
 */
export function exportToCSV(data: any[], filename: string) {
    if (!data || !data.length) {
        console.error("No hay datos para exportar");
        return;
    }

    // Obtener cabeceras (keys del primer objeto)
    const headers = Object.keys(data[0]);

    // Crear filas
    const csvRows = [
        headers.join(','), // Cabecera
        ...data.map(row => {
            return headers.map(header => {
                const val = row[header];
                // Manejar valores nulos, objetos (inclusiones/imágenes) y comas
                const stringVal = val === null || val === undefined
                    ? ''
                    : typeof val === 'object'
                        ? JSON.stringify(val).replace(/"/g, '""')
                        : String(val).replace(/"/g, '""');

                return `"${stringVal}"`;
            }).join(',');
        })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Crear link temporal para descarga
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
