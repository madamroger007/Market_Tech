import NextAuth, { getServerSession } from 'next-auth'
// import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const adminEmails = ['adamsetiadijr07@gmail.com', 'adamsetiadi12345@gmail.com']

export const authoptions = {
  providers: [
    // OAuth authentication providers...
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // Passwordless / github sign in
    GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({session,token,user}) => {
      if(adminEmails.includes(session?.user?.email)){
        return session;
      }
      else{
        return false;
      }
    }
  },
}

export default NextAuth(authoptions);
export async function isAdminRequest(req,res){
  const session = await getServerSession(req,res,authoptions);
  
  if(!adminEmails.includes(session?.user?.email)){
  res.status(401)
  res.end()
  throw "Not admin";

  }
}