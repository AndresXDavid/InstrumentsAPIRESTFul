const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
     definition: {
     openapi: "3.0.0",
     components: {
          securitySchemes: {
               bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
               }
          }
     },
     info: {
          title: "Taller Instrumentos API",
          version: "1.0.0",
     },
     servers: [{ url: "http://localhost:5500" }]
     },
     apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;