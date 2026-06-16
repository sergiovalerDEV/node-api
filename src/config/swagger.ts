import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Proyecto Ciudad NodeJS',
      version: '1.0.0',
      description: 'API REST para gestionar Ciudades y Lugares de interés asociados',
    },
    components: {
      schemas: {
        Coordinates: {
          type: 'array',
          items: { type: 'number', format: 'float' },
          minItems: 2,
          maxItems: 2,
          example: [40.4168, -3.7038],
        },
        Ciudad: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Madrid' },
            country: { type: 'string', example: 'España' },
            description: { type: 'string', example: 'Capital de España', nullable: true },
            coordinates: { $ref: '#/components/schemas/Coordinates' },
            timestamp: { type: 'integer', example: 1700000000 },
            habitants: { type: 'integer', example: 3400000 },
            image: { type: 'string', example: 'data:image/png;base64,iVBORw...' },
          },
        },
        CiudadConLugares: {
          allOf: [
            { $ref: '#/components/schemas/Ciudad' },
            {
              type: 'object',
              properties: {
                lugares: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Lugar' },
                },
              },
            },
          ],
        },
        CiudadInput: {
          type: 'object',
          required: ['name', 'country', 'coordinates', 'timestamp', 'habitants', 'image'],
          properties: {
            name: { type: 'string', example: 'Sevilla' },
            country: { type: 'string', example: 'España' },
            description: { type: 'string', example: 'Ciudad de la Giralda', nullable: true },
            coordinates: { $ref: '#/components/schemas/Coordinates' },
            timestamp: { type: 'integer', example: 1700000005 },
            habitants: { type: 'integer', example: 700000 },
            image: { type: 'string', example: 'data:image/png;base64,iVBORw...' },
          },
        },
        Lugar: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Museo del Prado' },
            description: { type: 'string', example: 'Museo nacional de pintura', nullable: true },
            coordinates: { $ref: '#/components/schemas/Coordinates' },
            timestamp: { type: 'integer', example: 1700001000 },
            ciudad_id: { type: 'integer', example: 1 },
          },
        },
        LugarInput: {
          type: 'object',
          required: ['name', 'coordinates', 'timestamp', 'ciudad_id'],
          properties: {
            name: { type: 'string', example: 'Parque del Retiro' },
            description: { type: 'string', example: 'Parque histórico', nullable: true },
            coordinates: { $ref: '#/components/schemas/Coordinates' },
            timestamp: { type: 'integer', example: 1700001001 },
            ciudad_id: { type: 'integer', example: 1 },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 3 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            pages: { type: 'integer', example: 1 },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { type: 'object' } },
            pagination: { $ref: '#/components/schemas/PaginationMeta' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Recurso no encontrado' },
          },
        },
      },
    },
    paths: {
      '/api/ciudades': {
        get: {
          tags: ['Ciudades'],
          summary: 'Obtener todas las ciudades (sin lugares, paginado)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1, minimum: 1 }, description: 'Página actual' },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, minimum: 1 }, description: 'Registros por página' },
          ],
          responses: {
            200: {
              description: 'Lista paginada de ciudades',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } },
            },
          },
        },
        post: {
          tags: ['Ciudades'],
          summary: 'Crear una ciudad',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CiudadInput' } } },
          },
          responses: {
            201: { description: 'Ciudad creada correctamente', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Datos de entrada inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/ciudades/{id}': {
        get: {
          tags: ['Ciudades'],
          summary: 'Obtener una ciudad con todos sus lugares',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Ciudad con sus lugares', content: { 'application/json': { schema: { $ref: '#/components/schemas/CiudadConLugares' } } } },
            404: { description: 'Ciudad no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        put: {
          tags: ['Ciudades'],
          summary: 'Modificar una ciudad',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CiudadInput' } } },
          },
          responses: {
            200: { description: 'Ciudad actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Ciudad no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        delete: {
          tags: ['Ciudades'],
          summary: 'Eliminar una ciudad',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Ciudad eliminada', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            404: { description: 'Ciudad no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/lugares': {
        post: {
          tags: ['Lugares'],
          summary: 'Crear un lugar',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LugarInput' } } },
          },
          responses: {
            201: { description: 'Lugar creado correctamente', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Ciudad no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/lugares/ciudad/{ciudad_id}': {
        get: {
          tags: ['Lugares'],
          summary: 'Obtener lugares de una ciudad (paginado)',
          parameters: [
            { name: 'ciudad_id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID de la ciudad' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1, minimum: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, minimum: 1 } },
          ],
          responses: {
            200: { description: 'Lista paginada de lugares', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } },
            404: { description: 'Ciudad no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/lugares/{id}': {
        get: {
          tags: ['Lugares'],
          summary: 'Obtener un lugar por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Lugar encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            404: { description: 'Lugar no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        put: {
          tags: ['Lugares'],
          summary: 'Modificar un lugar',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LugarInput' } } },
          },
          responses: {
            200: { description: 'Lugar actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Lugar no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        delete: {
          tags: ['Lugares'],
          summary: 'Eliminar un lugar',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Lugar eliminado', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            404: { description: 'Lugar no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
