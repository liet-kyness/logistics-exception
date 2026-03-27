import type { FastifyInstance } from "fastify";
import { getOverviewMetrics } from "../services/metrics.service";

export async function metricsRoutes(app: FastifyInstance) {
    app.get('/metrics/overview', async () => {
        const data = await getOverviewMetrics();
        return { data };
    });
}