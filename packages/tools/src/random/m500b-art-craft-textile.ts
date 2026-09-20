import { matrixAsJson } from "../matrix/as-json/tool.js";
import { array, object, label, integer } from "./m500b-art-craft-common.js";
export type ColorStock = { readonly id: string; readonly count: number };
export const colorStockSchema = array(
  object({ id: label, count: integer(0, 128) }),
  16,
  1,
);
export const chartSchema = array(array(integer(0, 15), 16, 1), 16, 1);
export const chartJson = (rows: readonly (readonly number[])[]): string => {
  const json = matrixAsJson(rows, 0);
  if (json === null)
    throw new Error(
      "A constructed rectangular color chart failed matrix serialization.",
    );
  return json;
};
