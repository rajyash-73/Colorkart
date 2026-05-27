import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  loginMutation: UseMutationResult<AuthUser, Error, { email: string; password: string }>;
  registerMutation: UseMutationResult<AuthUser, Error, { email: string; password: string; name?: string }>;
  logoutMutation: UseMutationResult<void, Error, void>;
  signInWithGoogle: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        });
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      const u = data.user!;
      return {
        id: u.id,
        email: u.email ?? '',
        name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
      };
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['currentUser'], user);
      toast({ title: "Welcome back!", description: `Signed in as ${user.email}` });
    },
    onError: (error: Error) => {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name?: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name || email.split('@')[0] } },
      });
      if (error) throw new Error(error.message);
      const u = data.user!;
      return {
        id: u.id,
        email: u.email ?? '',
        name: name || u.email?.split('@')[0] || 'User',
      };
    },
    onSuccess: (user) => {
      toast({ title: "Account created!", description: `Welcome, ${user.name}! Check your email to verify.` });
    },
    onError: (error: Error) => {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setUser(null);
      setSession(null);
      queryClient.setQueryData(['currentUser'], null);
      toast({ title: "Signed out", description: "See you next time!" });
    },
  });

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      toast({ title: "Google sign in failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, loginMutation, registerMutation, logoutMutation, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
