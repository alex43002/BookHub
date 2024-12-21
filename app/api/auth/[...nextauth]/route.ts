import NextAuth, { AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create handler with explicit typing
const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };