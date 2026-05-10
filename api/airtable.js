export default async function handler(req, res) {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { table, recordId, filterByFormula } = req.query;

  let url = `https://api.airtable.com/v0/${BASE}/${table}`;
  if (recordId) url += `/${recordId}`;
  if (filterByFormula) url += `?filterByFormula=${filterByFormula}`;

  const options = {
    method: req.method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (req.method === 'POST' || req.method === 'PATCH') {
    options.body = JSON.stringify(req.body);
  }

  const response = await fetch(url, options);
  const data = await response.json();
  return res.status(response.status).json(data);
}
