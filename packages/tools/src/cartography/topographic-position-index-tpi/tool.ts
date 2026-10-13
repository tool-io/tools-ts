import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mean, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly centerElevationM: number;
  readonly neighborElevationsM: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "centerElevationM", label: "Center elevation m", kind: "number" },
  {
    id: "neighborElevationsM",
    label: "Neighbor elevations m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (!i.neighborElevationsM.length)
    simpleError("neighbors", "Nonempty actual neighborhood.");
  return { tpiMeters: i.centerElevationM - mean(i.neighborElevationsM) };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { centerElevationM: 10, neighborElevationsM: [2, 4] },
  output: { result: { tpiMeters: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/topographic-position-index-tpi",
  title: "Topographic Position Index TPI Difference Calculator",
  description:
    "Signed center elevation minus unweighted actual neighborhood mean; no standardized landform class.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { tpiMeters: { type: "number" } },
        required: ["tpiMeters"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
