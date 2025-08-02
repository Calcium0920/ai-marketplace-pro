import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Simple Login',
      credentials: {
        name: { label: "名前", type: "text", placeholder: "山田太郎" }
      },
      async authorize(credentials) {
        if (credentials?.name) {
          return {
            id: '1',
            name: credentials.name,
            email: `${credentials.name}@example.com`,
            role: 'user', // roleプロパティを追加
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }