import NextAuth from 'next-auth';
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

            const nowTimeStamp = Math.floor(Date.now() / 1000);

            if(account){
                //La cuenta solo está disponible la primera vez que se realiza esta llamada de devolución de llamada en una nueva sesión

                //Decodifica el token de acceso y lo almacena en token.decored
                token.decored = jwt_decode(account.access_token);
                token.access_token = account.access_token;
                token.id_token = account.id_token;
                token.expires_token = account.expires_token;
                token.refresh_token = account.refresh_token
                token.accessToken = account.access-token;
                token.name = account.name;
                token.email = account.email;
                //token.image = account.image;
            }else if(nowTimeStamp < token.expires_token){
                //Si el token no ha expirado, devuelve el token
                return token;
            }else{
                //Si el token ha expirado, devuelve un token vacío
               console.log("Token Expirado")
            return token;
            }
        },
        async session ({session,token}){
            
            return session;
        }
    }
}

const handler = NextAuth(authOptions);
export {handler as GET , handler as POST}; 