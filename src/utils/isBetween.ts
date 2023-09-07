import * as _dayjs from "dayjs";
const dayjs = _dayjs;

export const isBetween = (time: Date) => {
  const inputTime = dayjs(time).unix();
  const morningTime = dayjs(time).hour(8).minute(29).unix();
  const eveningTime = dayjs(time).hour(15).minute(1).unix();
  if (inputTime > morningTime && inputTime < eveningTime) {
    return true;
  } else return false;
};
