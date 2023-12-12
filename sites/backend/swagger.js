import swaggerAutogen from 'swagger-autogen';

const doc = {
    info:{
        title:'Project K',
        description:'Project K is for users to downlod prebuild templates...',
        version: '0.1.1',
        contact:{
            name: 'Adateck',
            website: 'www.adateck.com',
        }
    },
    host:'localhost:3900'
}

const outputFile ='./swagger-output.json';
const routes = ['./startup/routes.js'];

swaggerAutogen(outputFile,routes,doc);