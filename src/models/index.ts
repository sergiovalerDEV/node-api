import Ciudad from './ciudad/ciudad.model';
import Lugar from '../models/lugar/lugar.model';

Ciudad.hasMany(Lugar, { foreignKey: 'ciudad_id', as: 'lugares' });
Lugar.belongsTo(Ciudad, { foreignKey: 'ciudad_id', as: 'ciudad' });

export { Ciudad, Lugar };
