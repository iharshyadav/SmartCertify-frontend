const ML_BASE_URL = process.env.NEXT_PUBLIC_ML_API_URL
    ? `${process.env.NEXT_PUBLIC_ML_API_URL}/api/ml`
    : "http://localhost:7860/api/ml"

async function mlRequest<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${ML_BASE_URL}${endpoint}`

    const config: RequestInit = {
        method: data ? "POST" : "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_ML_API_KEY ?? "smartcertify-dev-key",
        },
        // Don't use credentials:"include" for cross-origin HF Spaces (causes CORS preflight issues)
        ...(data && { body: JSON.stringify(data) }),
    }

    const response = await fetch(url, config)
    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.detail || result.message || `ML request failed: ${response.status}`)
    }

    // FastAPI returns data directly — NOT wrapped in { data: ... }
    return result as T
}

// ─── Types ───────────────────────────────────────────────────

export interface FraudResult {
    is_authentic: boolean
    fraud_probability: number
    confidence_score: number
    risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    risk_flags: string[]
    model_used: string
    latency_ms: number
}

export interface SimilarityResult {
    similarity_score: number
    is_duplicate: boolean
    method: string
    latency_ms: number
}

export interface ImageAnalysisResult {
    certificate_id: string
    is_tampered: boolean
    tamper_probability: number
    confidence: number
    analysis: {
        mean_brightness: number
        std_brightness: number
        channel_means: number[]
    }
    method: string
    latency_ms: number
}

export interface ChatResult {
    response: string
    confidence: number
    source: string
    latency_ms: number
}

export interface TrustScoreResult {
    issuer_id: string
    trust_score: number
    trust_grade: string
    factors: Record<string, number>
    latency_ms: number
}

export interface MLHealthResult {
    status: string
    service: string
    version: string
    models_loaded: string[]
    total_models: number
}

// ─── API Methods ─────────────────────────────────────────────

export const mlApi = {
    verifyCertificate: (data: {
        issuer_name: string
        recipient_name: string
        course_name: string
        issue_date: string
        expiry_date?: string
        issuer_reputation_score?: number
        template_match_score?: number
        metadata_completeness_score?: number
        domain_verification_status?: number
        previous_verification_count?: number
    }) => mlRequest<FraudResult>("/verify", data),

    checkSimilarity: (data: {
        cert_a: { issuer_name?: string; recipient_name?: string; course_name?: string }
        cert_b: { issuer_name?: string; recipient_name?: string; course_name?: string }
    }) => mlRequest<SimilarityResult>("/similarity", data),

    analyzeImage: (data: {
        image_base64: string
        certificate_id?: string
    }) => mlRequest<ImageAnalysisResult>("/analyze-image", data),

    chat: (data: {
        message: string
        session_id?: string
    }) => mlRequest<ChatResult>("/chat", data),

    getTrustScore: (data: {
        issuer_id: string
        total_certificates_issued?: number
        fraud_rate_historical?: number
        avg_metadata_completeness?: number
        domain_age_days?: number
        verification_success_rate?: number
    }) => mlRequest<TrustScoreResult>("/trust-score", data),

    detectAnomaly: (data: {
        certificates: Array<Record<string, any>>
    }) => mlRequest<any>("/anomaly", data),

    getRecommendations: (data: {
        student_id: string
        completed_courses?: string[]
    }) => mlRequest<any>("/recommend", data),

    getHealth: () => mlRequest<MLHealthResult>("/health"),
}
