import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Using standard Helvetica font for better PDF compatibility
// Font issues with custom fonts can cause rendering problems

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#d64518', // Primary color approximation
        paddingBottom: 10,
    },
    logo: {
        width: 120, // Adjust based on logo aspect ratio
        height: 'auto',
    },
    companyInfo: {
        textAlign: 'right',
        fontSize: 9,
        color: '#666',
    },
    titleSection: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        color: '#e11d48', // Unmistakable red (rose-600) to confirm update
        fontWeight: 'bold',
        marginBottom: 10,
        lineHeight: 1.4,
        paddingLeft: 5, // Extra space for the first letter
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#444',
    },
    destination: {
        fontSize: 11,
        color: '#888',
        marginTop: 4,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 15,
        color: '#222',
        fontWeight: 'bold',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 4,
    },
    text: {
        fontSize: 10,
        color: '#333',
        lineHeight: 1.5,
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        color: '#333',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    mainImage: {
        width: '80%', // Not full width to look less "huge"
        height: 150,
        objectFit: 'cover',
        borderRadius: 4,
        marginBottom: 10,
        alignSelf: 'center', // Center it
    },
    secondaryImage: {
        width: '30%',
        height: 80,
        objectFit: 'cover',
        borderRadius: 4,
    },
    priceSection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff5f2', // Light primary tint
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#d64518',
    },
    priceTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#d64518',
        marginBottom: 5,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 9,
        color: '#999',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    list: {
        marginLeft: 10,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    bullet: {
        width: 10,
        fontSize: 11,
    },
});

interface PackageData {
    title: string;
    description: string;
    short_description?: string;
    destination?: string; // Might need to be derived or added if not in props
    duration_days: number;
    duration_nights: number;
    price: number;
    currency_code: string;
    images: string[];
    includes: string[];
    excludes: string[];
}

interface PackagePDFProps {
    data: PackageData;
}

export const PackagePDF = ({ data }: PackagePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header with Logo */}
            <View style={styles.header}>
                {/* Make sure the logo path is accessible or base64 encoded. Public assets work in React-PDF if served correctly or imported? 
            React-PDF usually needs absolute URL or base64. 
            For local dev, window.location.origin + path might work.
            I'll use a placeholder or try to use the public path.
        */}
                <Image
                    style={styles.logo}
                    src={`${typeof window !== 'undefined' ? window.location.origin : ''}/logo-koneex-new.png`}
                />
                <View style={styles.companyInfo}>
                    <Text>Koneex Travel Agency</Text>
                    <Text>Calle 2 #353 x 11 y 15</Text>
                    <Text>Fracc. José María Iturralde. Mérida, Yucatán.</Text>
                    <Text>Tel: +52 (999) 924 3467</Text>
                    <Text>Email: contacto@koneex.com</Text>
                </View>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
                <View style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
                    <Text style={styles.title}>{data.title}</Text>
                </View>
                {data.destination && (
                    <Text style={styles.destination}>📍 {data.destination}</Text>
                )}
                {data.short_description && <Text style={styles.subtitle}>{data.short_description}</Text>}
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#666', marginRight: 15 }}>
                        Duración: {data.duration_days} Días / {data.duration_nights} Noches
                    </Text>
                </View>
            </View>

            {/* Main Image */}
            {data.images && data.images.length > 0 && (
                <Image style={styles.mainImage} src={data.images[0]} />
            )}

            {/* Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descripción del Viaje</Text>
                <Text style={styles.text}>{data.description}</Text>
            </View>

            {/* Includes & Excludes Grid */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%' }}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Incluye ✅</Text>
                        <View style={styles.list}>
                            {data.includes && data.includes.length > 0 ? (
                                data.includes.map((item, i) => (
                                    <View key={i} style={styles.listItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.text}>{item}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.text}>-</Text>
                            )}
                        </View>
                    </View>
                </View>

                <View style={{ width: '48%' }}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>No Incluye ❌</Text>
                        <View style={styles.list}>
                            {data.excludes && data.excludes.length > 0 ? (
                                data.excludes.map((item, i) => (
                                    <View key={i} style={styles.listItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.text}>{item}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.text}>-</Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            {/* Gallery (Small) */}
            {data.images && data.images.length > 1 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Más Fotos</Text>
                    <View style={styles.imageGrid}>
                        {data.images.slice(1, 4).map((img, i) => (
                            <Image key={i} style={styles.secondaryImage} src={img} />
                        ))}
                    </View>
                </View>
            )}

            {/* Price Footer */}
            <View style={styles.priceSection}>
                <Text style={styles.priceTitle}>Precio desde</Text>
                <Text style={styles.priceValue}>
                    ${Number(data.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })} {data.currency_code}
                </Text>
                <Text style={{ fontSize: 10, color: '#666', marginTop: 5 }}>
                    * Precios sujetos a cambios y disponibilidad. Contáctanos para reservar.
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Koneex Travel Agency - www.koneex.com - Tu aventura comienza aquí</Text>
            </View>
        </Page>
    </Document>
);
