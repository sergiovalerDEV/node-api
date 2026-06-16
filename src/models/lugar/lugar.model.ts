import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import type { Coordinates } from '../ciudad/ciudad.model';

export interface LugarAttributes {
  id: number;
  name: string;
  description: string | null;
  coordinates: Coordinates;
  timestamp: number;
  ciudad_id: number;
}

interface LugarCreationAttributes extends Optional<LugarAttributes, 'id'> {}

class Lugar
  extends Model<LugarAttributes, LugarCreationAttributes>
  implements LugarAttributes
{
  declare id: number;
  declare name: string;
  declare description: string | null;
  declare coordinates: Coordinates;
  declare timestamp: number;
  declare ciudad_id: number;
}

Lugar.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    coordinates: { type: DataTypes.JSON, allowNull: false },
    timestamp: { type: DataTypes.INTEGER, allowNull: false },
    ciudad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'ciudades', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'Lugar',
    tableName: 'lugares',
    timestamps: false,
  }
);

export default Lugar;
