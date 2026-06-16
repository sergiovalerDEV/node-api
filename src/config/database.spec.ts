import { describe, expect, it } from '@jest/globals';
import sequelize from './database';

describe('database config', () => {
  it('uses sqlite dialect', () => {
    expect(sequelize.getDialect()).toBe('sqlite');
  });
});
