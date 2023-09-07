import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "./apiAuth";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  type Props = {
    email: string;
    password: string;
  };
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }: Props) =>
      loginApi({
        email,
        password,
      }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);

      console.log(user);
      navigate("/dashboard/market", { replace: true });
    },
    onError: (err: Error) => {
      console.log("ERROR", err);
      return err;
    },
  });
  return { login, isLoading };
};
