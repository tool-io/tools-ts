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
    simpleError("neighbors", "Eight neighbors.");
  return {
    strictLocalPit: i.neighborElevationsM.every((v) => v > i.centerElevationM),
    flatNeighborPresent: i.neighborElevationsM.includes(i.centerElevationM),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { centerElevationM: 0, neighborElevationsM: [1, 1, 1, 1, 1, 1, 1, 1] },
  output: { result: { strictLocalPit: true, flatNeighborPresent: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/watershed-pit-detection-flag",
  title: "Watershed Divide Single Pit Detection Flag",
  description:
    "Strict local 8-neighbor raster pit flag; plateaus, no-data, divide connectivity and global drainage omitted.",
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
