import axios, { AxiosError } from "axios";
import supabase from "./supabase";

type SignupProps = {
  email: string;
  password: string;
  apikey: string;
};

export const signup = async ({ email, password, apikey }: SignupProps) => {
  try {
    await axios.get(
      `https://finnhub.io/api/v1/news?category=general&token=${apikey}`
    );
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error?.response?.data.error);
      if (error.response?.data.error == "Invalid API key")
        throw new Error(error.response.data.error);
      return;
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        apikey,
      },
    },
  });
  if (error) throw new Error(error.message);

  return data;
};

type Props = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: Props) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const getCurrentUser = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return null;
  }
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error();

  return data?.user;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getUserProfile = async () => {
  const { data: profiles, error } = await supabase.from("profiles").select("*");
  if (error) throw new Error(error.message);

  return profiles;
};
