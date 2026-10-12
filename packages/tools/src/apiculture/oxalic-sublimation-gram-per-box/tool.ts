import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly authorizedBoxes: number;
  readonly callerLabelgramsPerBox: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "authorizedBoxes", label: "Authorized boxes", kind: "number" },
  {
    id: "callerLabelgramsPerBox",
    label: "Caller labelgrams per box",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.authorizedBoxes, "units", 0, 1000);
  nonnegative(i.callerLabelgramsPerBox, "authorized rate");
  return {
    conditionalTotalGrams: i.authorizedBoxes * i.callerLabelgramsPerBox,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { authorizedBoxes: 5, callerLabelgramsPerBox: 2 },
  output: { result: { conditionalTotalGrams: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/oxalic-sublimation-gram-per-box",
  title: "Oxalic Sublimation Gram Per Box Calculator",
  description:
    "Inventory arithmetic only from independently authorized current label rate and actual authorizedBoxes; does not choose oxalic formulation, rate, permission or safe treatment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalTotalGrams: { type: "number" } },
        required: ["conditionalTotalGrams"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
