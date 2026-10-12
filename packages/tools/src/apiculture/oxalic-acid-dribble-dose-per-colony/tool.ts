import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly occupiedSeams: number;
  readonly callerLabelmLPerSeam: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "occupiedSeams", label: "Occupied seams", kind: "number" },
  {
    id: "callerLabelmLPerSeam",
    label: "Caller labelm l per seam",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.occupiedSeams, "units", 0, 1000);
  nonnegative(i.callerLabelmLPerSeam, "authorized rate");
  return { conditionalTotalMl: i.occupiedSeams * i.callerLabelmLPerSeam };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { occupiedSeams: 5, callerLabelmLPerSeam: 2 },
  output: { result: { conditionalTotalMl: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/oxalic-acid-dribble-dose-per-colony",
  title: "Oxalic Acid Dribble Dose Per Colony Calculator",
  description:
    "Inventory arithmetic only from independently authorized current label rate and actual occupiedSeams; does not choose oxalic formulation, rate, permission or safe treatment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalTotalMl: { type: "number" } },
        required: ["conditionalTotalMl"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
