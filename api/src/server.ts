import Fastify from 'fastify';
import { exceptionsRoutes } from './routes/exceptions';
import { metricsRoutes } from './routes/metrics';

const app = Fastify({ logger: true });

app.get('/health', async () => {
    return { status: "ok" };   
});

app.register(exceptionsRoutes);
app.register(metricsRoutes);

const start = async () => {
    try {
        await app.listen({ port: 3030, host: '0.0.0.0' });
        console.log('API listening on localhost:3030');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
