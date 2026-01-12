"use client"
import { useClerk, useAuth as useCleckAuth } from "@clerk/clerk-react"
import { useEffect, useState } from "react";

export const useAuth = () => {
  const {
    openSignIn,
    user,
  } = useClerk();
  const { signOut, getToken } = useCleckAuth();
  const [authToken, setAuthToken] = useState<string|undefined>();

  useEffect(() => {
    getToken()
      .then(x => setAuthToken(x ?? undefined))
      .catch(_ => setAuthToken(undefined));
  }, [])

  const userInfo = user ? {
    name: user.fullName,
    email: user.emailAddresses[0]?.emailAddress ?? "",
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
    },
    userInfo,
    token: authToken,
  }
}

export type Auth = ReturnType<typeof useAuth>;
export type UserInfo = Auth['userInfo'];