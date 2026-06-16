import Ciudad from './ciudad.model';
import Lugar from './lugar.model';

Ciudad.hasMany(Lugar, { foreignKey: 'ciudad_id', as: 'lugares' });
Lugar.belongsTo(Ciudad, { foreignKey: 'ciudad_id', as: 'ciudad' });

export { Ciudad, Lugar };
