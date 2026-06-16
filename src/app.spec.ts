import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { errorMiddleware } from './middlewares/errorMiddleware';
import * as http from 'http';

jest.mock('swagger-ui-express', () => {
    const setupFn = jest.fn(() => (_req: unknown, res: any, _next: any) => res.status(200).send('swagger'));
    const serveFn = jest.fn((_req: unknown, _res: unknown, next: any) => next());
    return {
        serve: serveFn,
        setup: setupFn,
        default: {
            serve: serveFn,
            setup: setupFn,
        },
    };
});

jest.mock('./config/swagger', () => ({
    swaggerSpec: {},
}));

jest.mock('./routes/index', () => {
    const express = require('express');
    const r = express.Router();
    r.get('/test', (_req: any, res: any) => res.status(200).json({ ok: true }));
    return { __esModule: true, default: r };
});

jest.mock('./middlewares/errorMiddleware', () => ({
    errorMiddleware: jest.fn((_err: unknown, _req: unknown, res: any, _next: any) => {
        res.status(500).json({ error: 'handled' });
    }),
}));

import { createApp } from './app';
import * as swaggerUi from 'swagger-ui-express';

const makeRequest = (app: any, path: string): Promise<number> => {
    return new Promise((resolve) => {
        const server = http.createServer(app);
        server.listen(0, () => {
            const port = (server.address() as any).port;
            http.get(`http://localhost:${port}${path}`, (res) => {
                server.close();
                resolve(res.statusCode ?? 0);
            }).on('error', () => {
                server.close();
                resolve(0);
            });
        });
    });
};

describe('createApp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls swagger setup exactly once', () => {
        createApp();
        expect(swaggerUi.setup).toHaveBeenCalledTimes(1);
    });

    it('returns an express app with api route mounted', async () => {
        const app = createApp();
        const status = await makeRequest(app, '/api/test');
        expect(status).toBe(200);
    });

    it('mounts the swagger docs route', async () => {
        const app = createApp();
        const status = await makeRequest(app, '/api-docs');
        expect(status).not.toBe(404);
    });

    it('includes error middleware as last layer', () => {
        createApp();
        expect(errorMiddleware).toBeDefined();
        expect(typeof errorMiddleware).toBe('function');
    });
});