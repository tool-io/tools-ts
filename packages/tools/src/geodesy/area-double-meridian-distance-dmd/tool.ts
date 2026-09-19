import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  northIncrementsMeters: readonly number[];
  eastIncrementsMeters: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "northIncrementsMeters",
    label: "North increments meters",
    kind: "numberList",
    unit: "m",
  },
  {
    id: "eastIncrementsMeters",
    label: "East increments meters",
    kind: "numberList",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.northIncrementsMeters.length >= 3 &&
      i.northIncrementsMeters.length === i.eastIncrementsMeters.length,
  );
  [...i.northIncrementsMeters, ...i.eastIncrementsMeters].forEach((x) =>
    H.magnitude(x, 1e6),
  );
  const scale = Math.max(
    1,
    ...i.northIncrementsMeters.map(Math.abs),
    ...i.eastIncrementsMeters.map(Math.abs),
  );
  H.check(
    Math.abs(i.northIncrementsMeters.reduce((s, x) => s + x, 0)) <=
      scale * 1e-10 &&
      Math.abs(i.eastIncrementsMeters.reduce((s, x) => s + x, 0)) <=
        scale * 1e-10,
    "An explicitly closed traverse is required",
  );
  const dmd: number[] = [];
  i.eastIncrementsMeters.forEach((v, j) =>
    dmd.push(j ? dmd[j - 1] + i.eastIncrementsMeters[j - 1] + v : v),
  );
  return H.finish({
    doubleMeridianDistancesMeters: dmd,
    signedAreaSquareMeters:
      dmd.reduce((s, x, j) => s + x * i.northIncrementsMeters[j], 0) / 2,
  });
};
export const example = {
  input: {
    northIncrementsMeters: [0, 1, 0, -1],
    eastIncrementsMeters: [1, 0, -1, 0],
  },
  output: {
    result: {
      doubleMeridianDistancesMeters: [1, 2, 1, 0],
      signedAreaSquareMeters: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/area-double-meridian-distance-dmd",
  title: "Area by Double Meridian Distance DMD Calculator",
  description:
    "Compute signed traverse area by double-meridian distances from explicitly closed local north/east leg increments; positive is counterclockwise in east/north coordinates, no geodetic area or hidden closure correction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
