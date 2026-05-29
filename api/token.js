export default async function handler(req, res) {
  const { code, code_verifier } = req.body;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: '31ad68fddbbb47dfa26e70f39d43d7ab',
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://jammming-gray.vercel.app/',
      code_verifier,
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}