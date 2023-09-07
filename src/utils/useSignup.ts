import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "./apiAuth";

export const useSignup = () => {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      return;
    },
  });

  return { signup, isLoading };
};
