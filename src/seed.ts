import { Ciudad, Lugar } from './models';

const seed = async (): Promise<void> => {
  const madrid = await Ciudad.create({
    name: 'Madrid',
    country: 'España',
    description: 'Capital de España y ciudad más poblada del país',
    coordinates: [40.4168, -3.7038],
    timestamp: 1700000000,
    habitants: 3400000,
    image: 'https://media.istockphoto.com/id/1059076792/photo/madrid-city-skyline-gran-via-street-twilight-spain.jpg?s=612x612&w=0&k=20&c=jQbBLWmR46lkJl-_OsYKLcykBweSNpf61H6NmcaHQxE=',
  });

  const zaragoza = await Ciudad.create({
    name: 'Zaragoza',
    country: 'España',
    description: 'Capital de Aragón, a orillas del Ebro',
    coordinates: [41.6488, -0.8891],
    timestamp: 1700000001,
    habitants: 674997,
    image: 'https://wallpaperaccess.com/full/2534262.jpg',
  });

  const sevilla = await Ciudad.create({
    name: 'Sevilla',
    country: 'España',
    description: 'Ciudad de la Giralda y la Torre del Oro',
    coordinates: [37.3886, -5.9823],
    timestamp: 1700000002,
    habitants: 688711,
    image: 'https://voyageursfrancais.fr/wp-content/uploads/2020/04/sevilleUNE-1.jpg',
  });

  await Lugar.create({ name: 'Museo del Prado', description: 'Museo nacional de pintura y escultura', coordinates: [40.4138, -3.6921], timestamp: 1700001000, ciudad_id: madrid.id });
  await Lugar.create({ name: 'Parque del Retiro', description: 'Parque histórico en el corazón de Madrid', coordinates: [40.4153, -3.6844], timestamp: 1700001001, ciudad_id: madrid.id });
  await Lugar.create({ name: 'Gran Vía', description: 'Principal avenida comercial y teatral de Madrid', coordinates: [40.4203, -3.7057], timestamp: 1700001002, ciudad_id: madrid.id });

  await Lugar.create({ name: 'Basílica del Pilar', description: 'Icónica basílica a orillas del Ebro', coordinates: [41.6561, -0.8773], timestamp: 1700002000, ciudad_id: zaragoza.id });
  await Lugar.create({ name: 'La Aljafería', description: 'Palacio fortificado de origen islámico', coordinates: [41.6558, -0.8988], timestamp: 1700002001, ciudad_id: zaragoza.id });
  await Lugar.create({ name: 'Mercado Central', description: 'Modernista mercado cubierto del centro de Zaragoza', coordinates: [41.6523, -0.8784], timestamp: 1700002002, ciudad_id: zaragoza.id });

  await Lugar.create({ name: 'Catedral de Sevilla', description: 'Catedral gótica con la famosa Giralda', coordinates: [37.3857, -5.9924], timestamp: 1700003000, ciudad_id: sevilla.id });
  await Lugar.create({ name: 'Torre del Oro', description: 'Torre dodecagonal a orillas del Guadalquivir', coordinates: [37.3826, -5.9963], timestamp: 1700003001, ciudad_id: sevilla.id });
  await Lugar.create({ name: 'Plaza de España', description: 'Espectacular plaza construida para la Exposición Iberoamericana de 1929', coordinates: [37.3772, -5.9869], timestamp: 1700003002, ciudad_id: sevilla.id });
};

export default seed;
