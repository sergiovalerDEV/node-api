import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { sendError, sendPaginated, sendSuccess } from './sendResponse';

describe('sendResponse', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sendSuccess sets default status 200', () => {
        sendSuccess(res, { foo: 'bar' });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('sendSuccess returns success json payload', () => {
        sendSuccess(res, { foo: 'bar' }, 201);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { foo: 'bar' } });
    });

    it('sendError sets provided status code', () => {
        sendError(res, 'fail', 400);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('sendError uses default status 500', () => {
        sendError(res, 'fail');
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('sendError returns error json payload', () => {
        sendError(res, 'fail', 500);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: 'fail' });
    });

    it('sendPaginated returns pagination metadata', () => {
        sendPaginated(res, [1, 2], 5, 1, 2);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: [1, 2],
            pagination: {
                total: 5,
                page: 1,
                limit: 2,
                pages: 3,
            },
        });
    });

    it('sendPaginated always uses status 200', () => {
        sendPaginated(res, [], 0, 1, 10);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
