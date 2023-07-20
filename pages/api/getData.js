import axios from 'axios';
export default async function handler(req, res) {
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
