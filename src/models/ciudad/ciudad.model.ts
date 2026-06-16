import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

export type Coordinates = [number, number];

export interface CiudadAttributes {
  id: number;
  name: string;
  country: string;
  description: string | null;
  coordinates: Coordinates;
  timestamp: number;
  habitants: number;
  image: string;
}

interface CiudadCreationAttributes extends Optional<CiudadAttributes, 'id'> {}

class Ciudad
  extends Model<CiudadAttributes, CiudadCreationAttributes>
  implements CiudadAttributes
{
  declare id: number;
  declare name: string;
  declare country: string;
  declare description: string | null;
  declare coordinates: Coordinates;
  declare timestamp: number;
  declare habitants: number;
  declare image: string;
}

Ciudad.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    coordinates: { type: DataTypes.JSON, allowNull: false },
    timestamp: { type: DataTypes.INTEGER, allowNull: false },
    habitants: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Ciudad',
    tableName: 'ciudades',
    timestamps: false,
  }
);

export default Ciudad;
