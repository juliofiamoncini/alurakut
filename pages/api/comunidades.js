import { SiteClient } from 'datocms-client';
const client = new SiteClient('5928e7a997e25daeaaefe51d15e564');

export default async function recebedorDeRequests(request, response) {

    console.log('request', request)

    if (request.method === 'POST') {
        // Validar os dados antes de sair cadastrando
        const record = await client.items.create({
            itemType: "968749", // model ID
            ...request.body
            /*
            title: request.body.title,
            imageUrl: request.body.imageUrl,
            creatorSlug: request.body.creatorSlug
            */
        });

        return response.json({
            registroCriado: record
        });
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, somente no POST!'
    })
}