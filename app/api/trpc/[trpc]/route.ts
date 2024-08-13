import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextResponse } from 'next/server';
import { appRouter } from "@/trpc";

const handler = async (req: Request) => {
    const response = await fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => ({})
    });

    return new NextResponse(response.body, {
        status: response.status,
        headers: response.headers,
    });
}

export { handler as GET, handler as POST };
