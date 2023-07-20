import axios from 'axios';
import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: ['http://localhost:5173', 'http://aeea.preprod.e2.rie.gouv.fr'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  console.log(req.body);

  const { data } = await axios.post(
    'https://www.demarches-simplifiees.fr/api/v2/graphql',
    {
      query: `query ge($dossierNumber: Int!) {
          dossier(number: $dossierNumber) {
            demandeur {
               ... on PersonnePhysique {
                prenom
                nom
                }
              }
            champs {
              label
              stringValue
            }
          }
        }`,
      variables: {
        includeDossiers: true,
        dossierNumber: parseInt(req.body.id),
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: process.env.TOKEN,
      },
    }
  );
  console.log(data);

  res.status(200).json(data);
}
