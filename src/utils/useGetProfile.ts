import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile as getUserProfileApi } from "./apiAuth";

export const useGetProfile = () => {
  const queryClient = useQueryClient();

  const { mutate: getProfile, isLoading } = useMutation({
    mutationFn: () => getUserProfileApi(),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
      localStorage.setItem("profile", JSON.stringify(profile));
      return profile;
    },
    onError: (err: Error) => {
      console.log("ERROR", err);
      return err;
    },
  });
  return { getProfile, isLoading };
};
