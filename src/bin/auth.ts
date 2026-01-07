import { useClerk, useAuth as useCleckAuth } from "@clerk/clerk-react"

export const useAuth = () => {
  const {
    openSignIn,
    user,
  } = useClerk();
  const { signOut } = useCleckAuth();

  const userInfo = user ? {
    name: user.fullName,
    email: user.emailAddresses[0].emailAddress
  } : undefined

  return {
    login: () => {
      if (userInfo) return [
        "Already loged with:",
        `\tName:  ${userInfo.name}`,
        `\tEmail: ${userInfo.email}`
      ].join("\n");

      openSignIn();
      return "login";
    },
    logOut: () => {
      signOut()
        .then(_ => window.location.reload());
      return "logout";
    }
  }
}

export type Auth = ReturnType<typeof useAuth>;