// Vercel Serverless Function - ログインプロキシ
// ブラウザから supabase.co へ直接届かない場合に、サーバー側で中継する

export default async function handler(req, res) {
  // CORS ヘッダー
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = 'https://utjtlrmvleagdypcnfky.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0anRscm12bGVhZ2R5cGNuZmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODgzNTksImV4cCI6MjA4OTU2NDM1OX0.CoE2ZNMHZGaVBjsq28uAMt0bRg4RzfNtDiOKcH8huOM';

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードを入力してください' });
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error_description || data.msg || 'ログインに失敗しました'
      });
    }

    // 成功: access_token / refresh_token をクライアントに返す
    return res.status(200).json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user
    });

  } catch (err) {
    return res.status(500).json({ error: 'サーバーエラー: ' + err.message });
  }
}
