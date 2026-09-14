import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedElevationsM: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedElevationsM",
    label: "Observed elevations m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (i.observedElevationsM.length < 2)
    simpleError("elevations", "At least two fixes.");
  return {
    cumulativeAscentM: sum(
      i.observedElevationsM
        .slice(1)
        .map((v, j) => Math.max(0, v - i.observedElevationsM[j])),
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedElevationsM: [0, 10, 5, 20] },
  output: { result: { cumulativeAscentM: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/cumulative-ascent-summator",
  title: "Route Cumulative Ascent Summator from Elevation List",
  description:
    "Sum positive rises along caller ordered measured elevation list; no DEM smoothing or route-position inference.",
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
