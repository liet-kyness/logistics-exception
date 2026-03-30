import type { ExceptionsResponse, ExceptionDetailResponse, OverviewMetric } from "./types";


/* NOTE: Server (Docker) :: http://api:3030
         Browser :: http://localhost:3030
         Local Dev :: http://localhost:3030
*/

// Docker vs. Local helper
export function getApiBaseUrl() {
    const baseUrl = 
        typeof window === 'undefined'
            ? process.env.INTERNAL_API_BASE_URL
            : process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        throw new Error(
            `Missing API base URL. INTERNAL_API_BASE_URL="${process.env.INTERNAL_API_BASE_URL}", NEXT_PUBLIC_API_BASE_URL="${process.env.NEXT_PUBLIC_API_BASE_URL}."`
        );
    }
    return baseUrl;
}



async function fetchJson<T>(path: string): Promise<T> {
    const baseUrl = getApiBaseUrl();

    const res = await fetch(`${baseUrl}${path}`, {
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