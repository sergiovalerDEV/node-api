import router from './index';

describe('index routes', () => {
    it('mounts ciudad and lugar routers', () => {
        const mountedRouters = router.stack.filter((layer: any) => layer.name === 'router');
        expect(mountedRouters.length).toBeGreaterThanOrEqual(2);
    });
});