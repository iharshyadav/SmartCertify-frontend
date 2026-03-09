import { ApiClient, ApiResponseError } from "./auth-api";
import { ApiError } from "./auth-types";

const certificateClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api");

export interface Certificate {
    id: string;
    name: string;
    issueDate: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface DashboardStats {
    totalCertificates: number;
    activeStudents: number;
    verifiedToday: number;
    successRate: number;
    pendingReviews: number;
    failedVerifications: number;
}

export interface PaginatedCertificates {
    data: Certificate[];
    meta: {
        total: number;
    }
}

export const certificateApi = {
    uploadCertificate: async (data: { name: string; issueDate: string; imageUrl: string }): Promise<{ success: boolean; data: Certificate }> => {
        try {
            const response = await certificateClient.post<{ success: boolean; data: Certificate }>("/certificates/upload", data);
            return response;
        } catch (error) {
            if (error instanceof ApiResponseError) {
                throw { message: error.message, status: error.status } as ApiError;
            }
            throw error;
        }
    },

    getCertificates: async (): Promise<{ success: boolean; data: Certificate[]; meta: { total: number } }> => {
        try {
            const response = await certificateClient.get<{ success: boolean; data: Certificate[]; meta: { total: number } }>("/certificates/list");
            return response;
        } catch (error) {
            if (error instanceof ApiResponseError) {
                throw { message: error.message, status: error.status } as ApiError;
            }
            throw error;
        }
    },

    getDashboardStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
        try {
            const response = await certificateClient.get<{ success: boolean; data: DashboardStats }>("/certificates/stats");
            return response;
        } catch (error) {
            if (error instanceof ApiResponseError) {
                throw { message: error.message, status: error.status } as ApiError;
            }
            throw error;
        }
    }
};
