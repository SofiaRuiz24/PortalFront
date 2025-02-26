import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { use } from 'react';


export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            //issuer: process.env.KEYCLOAK_ISSUER,
            issuer:"https://t72m2pk3-8080.brs.devtunnels.ms/realms/sasha",
            authorization: {
                params: {
                    scope: "openid email profile",
                    response_type: "code",
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            // Solo establece estas propiedades cuando account existe (primer inicio de sesión)
            if (account) {
                //console.log("Account:", account);
                //console.log("user", user);
                token.accessToken = account.access_token;

                //token.email = account.email;
                //token.name = account.name;
            }
            return token;
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            session.id = token.id;
            //console.log("Session:", session);
            //session.user.email = token.email;
            //session.user.name = token.name;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
