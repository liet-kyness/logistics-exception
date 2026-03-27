import type { ExceptionsResponse, ExceptionDetailResponse, OverviewMetric } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3030';

async function fetchJson<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} :: ${res.statusText}`);
    }
    return res.json();
}

export async function getOverviewMetrics(): Promise<OverviewMetric> {
    return fetchJson<OverviewMetric>('/metrics/overview');
}

export async function getExceptions(query?: string): Promise<ExceptionsResponse> {
    return fetchJson<ExceptionsResponse>(`/exceptions${query ? `?${query}` : ''}`);
}

export async function getExceptionById(id: string): Promise<ExceptionDetailResponse> {
    return fetchJson<ExceptionDetailResponse>(`/exceptions/${id}`);
}