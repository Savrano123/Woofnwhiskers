export default async function handler(req, res) {
  try {
    // Check for secret to confirm this is a valid request
    const { secret } = req.query;
    
    if (secret !== 'my_secret_token') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Path to revalidate
    const path = req.query.path || '/';
    
    // Revalidate the path
    await res.revalidate(path);
    
    return res.json({ 
      revalidated: true,
      message: `Path "${path}" revalidated successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send({
      message: 'Error revalidating',
      error: err.message,
      stack: err.stack
    });
  }
}
