import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly centerElevationM: number;
  readonly neighborElevationsM: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "centerElevationM", label: "Center elevation m", kind: "number" },
  {
    id: "neighborElevationsM",
    label: "Neighbor elevations m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (i.neighborElevationsM.length !== 8)
    simpleError("neighbors", "Eight observed neighbor cells.");
  return {
    triMeters: Math.hypot(
      ...i.neighborElevationsM.map((v) => v - i.centerElevationM),
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    centerElevationM: 10,
    neighborElevationsM: [11, 11, 11, 11, 11, 11, 11, 11],
  },
  output: { result: { triMeters: 2.8284271247461903 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/terrain-ruggedness-index-cell",
  title: "Terrain Ruggedness Index Cell Calculator",
  description:
    "Riley TRI sqrt(sum squared center-neighbor elevation differences), exactly eight caller observed neighbors.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
