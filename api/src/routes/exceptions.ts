import type { FastifyInstance } from 'fastify';
import { getExceptionById, getExceptions } from '../services/exceptions.service';

export async function exceptionsRoutes(app: FastifyInstance) {
  app.get('/exceptions', async (request) => {
    const { status, severity, ownerTeam, search } = request.query as {
      status?: string;
      severity?: string;
      ownerTeam?: string;
      search?: string;
    };

    const data = await getExceptions({
      status,
      severity,
      ownerTeam,
      search,
    });

    return { data };
  });

  app.get('/exceptions/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const data = await getExceptionById(Number(id));

    if (!data) return res.status(404).send({ error: 'Exception not found' });

    return { data };
  });
}