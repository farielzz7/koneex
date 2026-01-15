export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            agencies: {
                Row: {
                    address_line1: string | null
                    address_line2: string | null
                    city_id: number | null
                    created_at: string
                    default_commission_pct: number
                    default_markup_amount: number
                    deleted_at: string | null
                    email: string | null
                    id: number
                    legal_name: string | null
                    name: string
                    phone: string | null
                    postal_code: string | null
                    pricing_model: Database["public"]["Enums"]["pricing_model"]
                    rfc: string | null
                    status: Database["public"]["Enums"]["agency_status"]
                    updated_at: string
                    website: string | null
                }
                Insert: {
                    address_line1?: string | null
                    address_line2?: string | null
                    city_id?: number | null
                    created_at?: string
                    default_commission_pct?: number
                    default_markup_amount?: number
                    deleted_at?: string | null
                    email?: string | null
                    id?: number
                    legal_name?: string | null
                    name: string
                    phone?: string | null
                    postal_code?: string | null
                    pricing_model?: Database["public"]["Enums"]["pricing_model"]
                    rfc?: string | null
                    status?: Database["public"]["Enums"]["agency_status"]
                    updated_at?: string
                    website?: string | null
                }
                Update: {
                    address_line1?: string | null
                    address_line2?: string | null
                    city_id?: number | null
                    created_at?: string
                    default_commission_pct?: number
                    default_markup_amount?: number
                    deleted_at?: string | null
                    email?: string | null
                    id?: number
                    legal_name?: string | null
                    name?: string
                    phone?: string | null
                    postal_code?: string | null
                    pricing_model?: Database["public"]["Enums"]["pricing_model"]
                    rfc?: string | null
                    status?: Database["public"]["Enums"]["agency_status"]
                    updated_at?: string
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "agencies_city_id_fkey"
                        columns: ["city_id"]
                        isOneToOne: false
                        referencedRelation: "cities"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cities: {
                Row: {
                    country_id: number
                    created_at: string
                    id: number
                    latitude: number | null
                    longitude: number | null
                    name: string
                    state: string | null
                    updated_at: string
                }
                Insert: {
                    country_id: number
                    created_at?: string
                    id?: number
                    latitude?: number | null
                    longitude?: number | null
                    name: string
                    state?: string | null
                    updated_at?: string
                }
                Update: {
                    country_id?: number
                    created_at?: string
                    id?: number
                    latitude?: number | null
                    longitude?: number | null
                    name?: string
                    state?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "cities_country_id_fkey"
                        columns: ["country_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    }
                ]
            }
            countries: {
                Row: {
                    created_at: string
                    id: number
                    iso2: string
                    name: string
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    id?: number
                    iso2: string
                    name: string
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    id?: number
                    iso2?: string
                    name?: string
                    updated_at?: string
                }
                Relationships: []
            }
            currencies: {
                Row: {
                    code: string
                    created_at: string
                    name: string
                    symbol: string | null
                    updated_at: string
                }
                Insert: {
                    code: string
                    created_at?: string
                    name: string
                    symbol?: string | null
                    updated_at?: string
                }
                Update: {
                    code?: string
                    created_at?: string
                    name?: string
                    symbol?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            destinations: {
                Row: {
                    city_id: number | null
                    created_at: string
                    description: string | null
                    hero_image_url: string | null
                    id: number
                    is_featured: boolean
                    name: string
                    slug: string
                    updated_at: string
                }
                Insert: {
                    city_id?: number | null
                    created_at?: string
                    description?: string | null
                    hero_image_url?: string | null
                    id?: number
                    is_featured?: boolean
                    name: string
                    slug: string
                    updated_at?: string
                }
                Update: {
                    city_id?: number | null
                    created_at?: string
                    description?: string | null
                    hero_image_url?: string | null
                    id?: number
                    is_featured?: boolean
                    name?: string
                    slug?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "destinations_city_id_fkey"
                        columns: ["city_id"]
                        isOneToOne: false
                        referencedRelation: "cities"
                        referencedColumns: ["id"]
                    }
                ]
            }
            orders: {
                Row: {
                    agency_id: number | null
                    cancelled_at: string | null
                    commission_amount: number | null
                    commission_pct: number | null
                    completed_at: string | null
                    created_at: string
                    currency_code: string
                    customer_id: number
                    deleted_at: string | null
                    discount_total: number
                    id: number
                    net_total: number | null
                    notes: string | null
                    order_number: string
                    paid_at: string | null
                    promotion_code: string | null
                    status: Database["public"]["Enums"]["order_status"]
                    subtotal: number
                    tax_total: number
                    total: number
                    updated_at: string
                }
                Insert: {
                    agency_id?: number | null
                    cancelled_at?: string | null
                    commission_amount?: number | null
                    commission_pct?: number | null
                    completed_at?: string | null
                    created_at?: string
                    currency_code: string
                    customer_id: number
                    deleted_at?: string | null
                    discount_total?: number
                    id?: number
                    net_total?: number | null
                    notes?: string | null
                    order_number?: string
                    paid_at?: string | null
                    promotion_code?: string | null
                    status?: Database["public"]["Enums"]["order_status"]
                    subtotal?: number
                    tax_total?: number
                    total?: number
                    updated_at?: string
                }
                Update: {
                    agency_id?: number | null
                    cancelled_at?: string | null
                    commission_amount?: number | null
                    commission_pct?: number | null
                    completed_at?: string | null
                    created_at?: string
                    currency_code?: string
                    customer_id?: number
                    deleted_at?: string | null
                    discount_total?: number
                    id?: number
                    net_total?: number | null
                    notes?: string | null
                    order_number?: string
                    paid_at?: string | null
                    promotion_code?: string | null
                    status?: Database["public"]["Enums"]["order_status"]
                    subtotal?: number
                    tax_total?: number
                    total?: number
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "orders_agency_id_fkey"
                        columns: ["agency_id"]
                        isOneToOne: false
                        referencedRelation: "agencies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "orders_currency_code_fkey"
                        columns: ["currency_code"]
                        isOneToOne: false
                        referencedRelation: "currencies"
                        referencedColumns: ["code"]
                    },
                    {
                        foreignKeyName: "orders_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            package_components: {
                Row: {
                    component_type: Database["public"]["Enums"]["component_type"]
                    created_at: string
                    description: string | null
                    details: Json | null
                    id: number
                    is_included: boolean
                    package_id: number
                    position: number
                    title: string
                    updated_at: string
                }
                Insert: {
                    component_type: Database["public"]["Enums"]["component_type"]
                    created_at?: string
                    description?: string | null
                    details?: Json | null
                    id?: number
                    is_included?: boolean
                    package_id: number
                    position?: number
                    title: string
                    updated_at?: string
                }
                Update: {
                    component_type?: Database["public"]["Enums"]["component_type"]
                    created_at?: string
                    description?: string | null
                    details?: Json | null
                    id?: number
                    is_included?: boolean
                    package_id?: number
                    position?: number
                    title?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "package_components_package_id_fkey"
                        columns: ["package_id"]
                        isOneToOne: false
                        referencedRelation: "packages"
                        referencedColumns: ["id"]
                    }
                ]
            }
            package_departures: {
                Row: {
                    available_seats: number | null
                    capacity: number | null
                    created_at: string
                    departure_date: string
                    id: number
                    notes: string | null
                    package_id: number
                    return_date: string | null
                    status: Database["public"]["Enums"]["departure_status"]
                    updated_at: string
                }
                Insert: {
                    available_seats?: number | null
                    capacity?: number | null
                    created_at?: string
                    departure_date: string
                    id?: number
                    notes?: string | null
                    package_id: number
                    return_date?: string | null
                    status?: Database["public"]["Enums"]["departure_status"]
                    updated_at?: string
                }
                Update: {
                    available_seats?: number | null
                    capacity?: number | null
                    created_at?: string
                    departure_date?: string
                    id?: number
                    notes?: string | null
                    package_id?: number
                    return_date?: string | null
                    status?: Database["public"]["Enums"]["departure_status"]
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "package_departures_package_id_fkey"
                        columns: ["package_id"]
                        isOneToOne: false
                        referencedRelation: "packages"
                        referencedColumns: ["id"]
                    }
                ]
            }
            package_itinerary_days: {
                Row: {
                    accommodation_text: string | null
                    created_at: string
                    day_number: number
                    description: string | null
                    id: number
                    included_activities: Json | null
                    meals_included: Json | null
                    notes: string | null
                    optional_activities: Json | null
                    package_id: number
                    title: string | null
                    updated_at: string
                }
                Insert: {
                    accommodation_text?: string | null
                    created_at?: string
                    day_number: number
                    description?: string | null
                    id?: number
                    included_activities?: Json | null
                    meals_included?: Json | null
                    notes?: string | null
                    optional_activities?: Json | null
                    package_id: number
                    title?: string | null
                    updated_at?: string
                }
                Update: {
                    accommodation_text?: string | null
                    created_at?: string
                    day_number?: number
                    description?: string | null
                    id?: number
                    included_activities?: Json | null
                    meals_included?: Json | null
                    notes?: string | null
                    optional_activities?: Json | null
                    package_id?: number
                    title?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "package_itinerary_days_package_id_fkey"
                        columns: ["package_id"]
                        isOneToOne: false
                        referencedRelation: "packages"
                        referencedColumns: ["id"]
                    }
                ]
            }
            package_media: {
                Row: {
                    alt_text: string | null
                    caption: string | null
                    created_at: string
                    deleted_at: string | null
                    duration_seconds: number | null
                    height: number | null
                    id: number
                    is_cover: boolean
                    media_type: Database["public"]["Enums"]["media_type"]
                    mime_type: string | null
                    package_id: number
                    position: number
                    size_bytes: number | null
                    thumbnail_url: string | null
                    updated_at: string
                    url: string
                    width: number | null
                }
                Insert: {
                    alt_text?: string | null
                    caption?: string | null
                    created_at?: string
                    deleted_at?: string | null
                    duration_seconds?: number | null
                    height?: number | null
                    id?: number
                    is_cover?: boolean
                    media_type: Database["public"]["Enums"]["media_type"]
                    mime_type?: string | null
                    package_id: number
                    position?: number
                    size_bytes?: number | null
                    thumbnail_url?: string | null
                    updated_at?: string
                    url: string
                    width?: number | null
                }
                Update: {
                    alt_text?: string | null
                    caption?: string | null
                    created_at?: string
                    deleted_at?: string | null
                    duration_seconds?: number | null
                    height?: number | null
                    id?: number
                    is_cover?: boolean
                    media_type?: Database["public"]["Enums"]["media_type"]
                    mime_type?: string | null
                    package_id?: number
                    position?: number
                    size_bytes?: number | null
                    thumbnail_url?: string | null
                    updated_at?: string
                    url?: string
                    width?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "package_media_package_id_fkey"
                        columns: ["package_id"]
                        isOneToOne: false
                        referencedRelation: "packages"
                        referencedColumns: ["id"]
                    }
                ]
            }
            packages: {
                Row: {
                    confirmation_mode: Database["public"]["Enums"]["confirmation_mode"]
                    created_at: string
                    currency_code: string
                    deleted_at: string | null
                    description: string | null
                    duration_days: number | null
                    duration_nights: number | null
                    ends_at: string | null
                    excludes: Json | null
                    from_price: number
                    highlights: Json | null
                    id: number
                    includes: Json | null
                    max_people: number | null
                    min_age: number | null
                    product_type: Database["public"]["Enums"]["package_type"]
                    provider_id: number | null
                    provider_last_seen_at: string | null
                    provider_product_code: string | null
                    short_description: string | null
                    slug: string
                    starts_at: string | null
                    status: Database["public"]["Enums"]["package_status"]
                    subtitle: string | null
                    title: string
                    updated_at: string
                }
                Insert: {
                    confirmation_mode?: Database["public"]["Enums"]["confirmation_mode"]
                    created_at?: string
                    currency_code: string
                    deleted_at?: string | null
                    description?: string | null
                    duration_days?: number | null
                    duration_nights?: number | null
                    ends_at?: string | null
                    excludes?: Json | null
                    from_price?: number
                    highlights?: Json | null
                    id?: number
                    includes?: Json | null
                    max_people?: number | null
                    min_age?: number | null
                    product_type?: Database["public"]["Enums"]["package_type"]
                    provider_id?: number | null
                    provider_last_seen_at?: string | null
                    provider_product_code?: string | null
                    short_description?: string | null
                    slug: string
                    starts_at?: string | null
                    status?: Database["public"]["Enums"]["package_status"]
                    subtitle?: string | null
                    title: string
                    updated_at?: string
                }
                Update: {
                    confirmation_mode?: Database["public"]["Enums"]["confirmation_mode"]
                    created_at?: string
                    currency_code?: string
                    deleted_at?: string | null
                    description?: string | null
                    duration_days?: number | null
                    duration_nights?: number | null
                    ends_at?: string | null
                    excludes?: Json | null
                    from_price?: number
                    highlights?: Json | null
                    id?: number
                    includes?: Json | null
                    max_people?: number | null
                    min_age?: number | null
                    product_type?: Database["public"]["Enums"]["package_type"]
                    provider_id?: number | null
                    provider_last_seen_at?: string | null
                    provider_product_code?: string | null
                    short_description?: string | null
                    slug?: string
                    starts_at?: string | null
                    status?: Database["public"]["Enums"]["package_status"]
                    subtitle?: string | null
                    title?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "packages_currency_code_fkey"
                        columns: ["currency_code"]
                        isOneToOne: false
                        referencedRelation: "currencies"
                        referencedColumns: ["code"]
                    },
                    {
                        foreignKeyName: "packages_provider_id_fkey"
                        columns: ["provider_id"]
                        isOneToOne: false
                        referencedRelation: "providers"
                        referencedColumns: ["id"]
                    }
                ]
            }
            providers: {
                Row: {
                    api_key_hint: string | null
                    base_url: string | null
                    contact_email: string | null
                    contact_phone: string | null
                    created_at: string
                    id: number
                    integration_mode: Database["public"]["Enums"]["integration_mode"]
                    name: string
                    status: Database["public"]["Enums"]["provider_status"]
                    type: Database["public"]["Enums"]["provider_type"]
                    updated_at: string
                    website: string | null
                }
                Insert: {
                    api_key_hint?: string | null
                    base_url?: string | null
                    contact_email?: string | null
                    contact_phone?: string | null
                    created_at?: string
                    id?: number
                    integration_mode?: Database["public"]["Enums"]["integration_mode"]
                    name: string
                    status?: Database["public"]["Enums"]["provider_status"]
                    type?: Database["public"]["Enums"]["provider_type"]
                    updated_at?: string
                    website?: string | null
                }
                Update: {
                    api_key_hint?: string | null
                    base_url?: string | null
                    contact_email?: string | null
                    contact_phone?: string | null
                    created_at?: string
                    id?: number
                    integration_mode?: Database["public"]["Enums"]["integration_mode"]
                    name?: string
                    status?: Database["public"]["Enums"]["provider_status"]
                    type?: Database["public"]["Enums"]["provider_type"]
                    updated_at?: string
                    website?: string | null
                }
                Relationships: []
            }
            users: {
                Row: {
                    agency_id: number | null
                    created_at: string
                    deleted_at: string | null
                    email: string
                    email_verified_at: string | null
                    id: number
                    name: string
                    password: string | null
                    phone: string | null
                    registered_at: string
                    role: Database["public"]["Enums"]["user_role"]
                    status: Database["public"]["Enums"]["user_status"]
                    updated_at: string
                }
                Insert: {
                    agency_id?: number | null
                    created_at?: string
                    deleted_at?: string | null
                    email: string
                    email_verified_at?: string | null
                    id?: number
                    name: string
                    password?: string | null
                    phone?: string | null
                    registered_at?: string
                    role?: Database["public"]["Enums"]["user_role"]
                    status?: Database["public"]["Enums"]["user_status"]
                    updated_at?: string
                }
                Update: {
                    agency_id?: number | null
                    created_at?: string
                    deleted_at?: string | null
                    email?: string
                    email_verified_at?: string | null
                    id?: number
                    name?: string
                    password?: string | null
                    phone?: string | null
                    registered_at?: string
                    role?: Database["public"]["Enums"]["user_role"]
                    status?: Database["public"]["Enums"]["user_status"]
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "users_agency_id_fkey"
                        columns: ["agency_id"]
                        isOneToOne: false
                        referencedRelation: "agencies"
                        referencedColumns: ["id"]
                    }
                ]
            }
            order_items: {
                Row: {
                    departure_id: number | null
                    details: Json | null
                    id: number
                    item_type: Database["public"]["Enums"]["order_item_type"]
                    order_id: number
                    package_id: number | null
                    pax_adults: number
                    pax_children: number
                    pax_infants: number
                    quantity: number
                    total_price: number
                    unit_price: number
                    title: string
                }
                Insert: {
                    departure_id?: number | null
                    details?: Json | null
                    id?: number
                    item_type?: Database["public"]["Enums"]["order_item_type"]
                    order_id: number
                    package_id?: number | null
                    pax_adults?: number
                    pax_children?: number
                    pax_infants?: number
                    quantity?: number
                    total_price: number
                    unit_price: number
                    title: string
                }
                Update: {
                    departure_id?: number | null
                    details?: Json | null
                    id?: number
                    item_type?: Database["public"]["Enums"]["order_item_type"]
                    order_id?: number
                    package_id?: number | null
                    pax_adults?: number
                    pax_children?: number
                    pax_infants?: number
                    quantity?: number
                    total_price?: number
                    unit_price?: number
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_departure_id_fkey"
                        columns: ["departure_id"]
                        isOneToOne: false
                        referencedRelation: "package_departures"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_package_id_fkey"
                        columns: ["package_id"]
                        isOneToOne: false
                        referencedRelation: "packages"
                        referencedColumns: ["id"]
                    }
                ]
            }
            order_travelers: {
                Row: {
                    birth_date: string | null
                    document_number: string | null
                    document_type: Database["public"]["Enums"]["document_type"] | null
                    email: string | null
                    first_name: string
                    gender: Database["public"]["Enums"]["gender_type"] | null
                    id: number
                    last_name: string
                    nationality_code: string | null
                    order_id: number
                    phone: string | null
                }
                Insert: {
                    birth_date?: string | null
                    document_number?: string | null
                    document_type?: Database["public"]["Enums"]["document_type"] | null
                    email?: string | null
                    first_name: string
                    gender?: Database["public"]["Enums"]["gender_type"] | null
                    id?: number
                    last_name: string
                    nationality_code?: string | null
                    order_id: number
                    phone?: string | null
                }
                Update: {
                    birth_date?: string | null
                    document_number?: string | null
                    document_type?: Database["public"]["Enums"]["document_type"] | null
                    email?: string | null
                    first_name?: string
                    gender?: Database["public"]["Enums"]["gender_type"] | null
                    id?: number
                    last_name?: string
                    nationality_code?: string | null
                    order_id?: number
                    phone?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "order_travelers_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    }
                ]
            }
            payments: {
                Row: {
                    amount: number
                    created_at: string
                    currency_code: string
                    external_reference: string | null
                    id: number
                    notes: string | null
                    order_id: number
                    payment_method: string | null
                    provider: Database["public"]["Enums"]["payment_provider"] | null
                    status: Database["public"]["Enums"]["payment_status"]
                    updated_at: string
                }
                Insert: {
                    amount: number
                    created_at?: string
                    currency_code: string
                    external_reference?: string | null
                    id?: number
                    notes?: string | null
                    order_id: number
                    payment_method?: string | null
                    provider?: Database["public"]["Enums"]["payment_provider"] | null
                    status?: Database["public"]["Enums"]["payment_status"]
                    updated_at?: string
                }
                Update: {
                    amount?: number
                    created_at?: string
                    currency_code?: string
                    external_reference?: string | null
                    id?: number
                    notes?: string | null
                    order_id?: number
                    payment_method?: string | null
                    provider?: Database["public"]["Enums"]["payment_provider"] | null
                    status?: Database["public"]["Enums"]["payment_status"]
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "payments_currency_code_fkey"
                        columns: ["currency_code"]
                        isOneToOne: false
                        referencedRelation: "currencies"
                        referencedColumns: ["code"]
                    },
                    {
                        foreignKeyName: "payments_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    }
                ]
            }
            vouchers: {
                Row: {
                    booking_reference: string | null
                    created_at: string
                    file_url: string | null
                    id: number
                    issued_at: string
                    order_id: number
                    status: Database["public"]["Enums"]["voucher_status"]
                    updated_at: string
                }
                Insert: {
                    booking_reference?: string | null
                    created_at?: string
                    file_url?: string | null
                    id?: number
                    issued_at?: string
                    order_id: number
                    status?: Database["public"]["Enums"]["voucher_status"]
                    updated_at?: string
                }
                Update: {
                    booking_reference?: string | null
                    created_at?: string
                    file_url?: string | null
                    id?: number
                    issued_at?: string
                    order_id?: number
                    status?: Database["public"]["Enums"]["voucher_status"]
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "vouchers_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            generate_order_number: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
        }
        Enums: {
            agency_status: "ACTIVE" | "SUSPENDED"
            component_type: "HOTEL" | "FLIGHT" | "TRANSFER" | "TOUR" | "INSURANCE" | "EXTRA"
            confirmation_mode: "INSTANT" | "ON_REQUEST"
            departure_status: "OPEN" | "CLOSED" | "SOLD_OUT"
            discount_type: "PERCENT" | "AMOUNT"
            document_type: "INE" | "PASSPORT" | "OTHER"
            gender_type: "M" | "F" | "X"
            integration_mode: "MANUAL" | "CSV" | "API"
            media_type: "IMAGE" | "VIDEO"
            occupancy_type: "SGL" | "DBL" | "TPL" | "CPL"
            order_status: "DRAFT" | "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REFUNDED"
            package_status: "DRAFT" | "PUBLISHED" | "PAUSED"
            package_type: "CIRCUIT" | "HOTEL_PACKAGE" | "EXPERIENCE" | "TRANSFER" | "DYNAMIC"
            pax_type: "ADULT" | "CHILD" | "INFANT"
            pricing_model: "PUBLIC_ONLY" | "NET_WITH_COMMISSION" | "MARGIN_MARKUP"
            provider_status: "ACTIVE" | "INACTIVE"
            provider_type: "WHOLESALER" | "OPERATOR" | "HOTEL" | "AIRLINE" | "OTHER"
            sync_status: "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL"
            tag_type: "CATEGORY" | "THEME" | "AUDIENCE" | "BADGE" | "AMENITY" | "OTHER"
            user_role: "ADMIN" | "AGENCY_ADMIN" | "AGENT" | "CUSTOMER" | "SUPPORT"
            user_status: "ACTIVE" | "BLOCKED"
            order_item_type: "PACKAGE" | "HOTEL" | "FLIGHT" | "TRANSFER" | "INSURANCE" | "EXTRA"
            payment_provider: "STRIPE" | "PAYPAL" | "BANK_TRANSFER" | "CASH" | "OTHER"
            payment_status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
            voucher_status: "DRAFT" | "ISSUED" | "CANCELLED"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
