/*import NextAuth from 'next-auth';
import KeycloackProvider from 'next-auth/providers/keycloak';
import jwt_decode from 'jwt-decode';


export const authOptions={
    providers : [ 
        KeycloackProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER,
            //realm: process.env.KEYCLOAK_REALM,
            //url: process.env.KEYCLOAK_URL,

        })
    ],
    callbacks: {
        async jwt ({token ,account}){
            console.log("Token:", token);
            console.log("Account:", account);

            const nowTimeStamp = Math.floor(Date.now() / 1000);

            if(account){
                //La cuenta solo está disponible la primera vez que se realiza esta llamada de devolución de llamada en una nueva sesión

                //Decodifica el token de acceso y lo almacena en token.decored
                token.decored = jwt_decode(account.access_token);
                token.accesstoken = account.access_token;
                token.id_token = account.id_token;
                token.expires_token = account.expires_token;
                token.refresh_token = account.refresh_token
                token.accessToken = account.access_token;
                token.name = account.name;
                token.email = account.email;
                //token.role = account.groups[0];
                //token.image = account.image;
                
            }else if(nowTimeStamp < token.expires_token){

                //Si el token no ha expirado, devuelve el token
                return token;
            }else{

                //Si el token ha expirado, devuelve un token vacío
               console.log("Token Expirado. Refrescando Token...");
               //TO DO : Refresh Token
            return token;
            }
        },
        async session ({session, token}){
            /*if (session?.user) {
                session.user.role = token.role || null;
            }
            session.user.email = token.email;
            console.log("Session:", session);
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);
export {handler as GET , handler as POST}; 
*/
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';


export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER,
            authorization: {
                params: { scope: "openid email profile" } // Asegura que Keycloak envíe estos datos
                
            },
            url: "http://localhost:8080",
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            console.log("Token:", token);
            token.accessToken = account.access_token;
            token.userProp = account.userProp;
            token.email = account.email;
            token.name = account.name;
            return token;
        },
        async session({ session, token }) {
            session.user.email = token.email;
            session.user.name = token.name;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
