export const GET = async (req: Request) => {

    const res = await fetch("https://media.mlsgrid.com/token=gvYCKYKG1n3H63pi2odu8C2xnYIRtl3nP-9vY_ARo6o&expires=1761642183&id=68efaf2392e35c0fe9a26fe0/images/KEY421131811/e4a79c3f-a58a-4436-a732-368ec284bd65.jpeg")

    const data = await res.json();


    return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}