export async function GET() {
    try {
        const response = await fetch('https://api.hetrixtools.com/v3/uptime-monitors', {
            headers: {
                'Authorization': `Bearer ${process.env.HETRIX_API_KEY}`
            },
            next: { revalidate: 60 } // Cache for 60 seconds (1 minute)
        });

        if (!response.ok) throw new Error(`API fout: ${response.status}`);
        const data = await response.json();

        return new Response(JSON.stringify(data.monitors), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60, s-maxage=60'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
