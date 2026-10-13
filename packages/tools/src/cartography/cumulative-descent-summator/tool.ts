import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedElevationsM: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedElevationsM",
    label: "Observed elevations m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (i.observedElevationsM.length < 2)
    simpleError("elevations", "At least two fixes.");
  return {
    cumulativeDescentM: sum(
      i.observedElevationsM
        .slice(1)
        .map((v, j) => Math.max(0, i.observedElevationsM[j] - v)),
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedElevationsM: [0, 10, 5, 20] },
  output: { result: { cumulativeDescentM: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/cumulative-descent-summator",
  title: "Route Cumulative Descent Summator from Elevation List",
  description:
    "Sum positive falls along caller ordered measured elevation list; no DEM smoothing or route-position inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { cumulativeDescentM: { type: "number" } },
        required: ["cumulativeDescentM"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
