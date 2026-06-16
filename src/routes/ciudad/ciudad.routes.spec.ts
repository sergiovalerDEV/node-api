import { describe, expect, it } from '@jest/globals';
import router from './ciudad.routes';

describe('ciudad routes', () => {
  it('defines expected ciudad route paths', () => {
    const paths = router.stack.filter((layer: any) => layer.route).map((layer: any) => layer.route.path);
    expect(paths).toEqual(['/', '/:id', '/', '/:id', '/:id']);
  });
});
