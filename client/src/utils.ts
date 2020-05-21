import { Entry } from "./types";

export const assertNever = (any: never): never => {
  throw new Error("Exhaustive type checking violated");
};

export const camelCaseToSpace = (str: string): string => {
  return str.split(/([A-Z][^A-Z]*)/).join(" ");
};

export const sortByDate = (a: Entry, b: Entry) => {
  const aTime = new Date(a.date).getTime();
  const bTime = new Date(b.date).getTime();
  return bTime - aTime;
};

export const getKeysFromEnum = (e: { [P: string]: any }) =>
  Object.keys(e).filter((k) => !isNaN(Number((e as any)[k])));
