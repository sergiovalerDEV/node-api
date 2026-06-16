import { describe, expect, it } from '@jest/globals';
import router from './lugar.routes';

describe('lugar routes', () => {
  it('defines expected lugar route paths', () => {
    const paths = router.stack.filter((layer: any) => layer.route).map((layer: any) => layer.route.path);
    expect(paths).toEqual(['/ciudad/:ciudad_id', '/:id', '/', '/:id', '/:id']);
  });
});
