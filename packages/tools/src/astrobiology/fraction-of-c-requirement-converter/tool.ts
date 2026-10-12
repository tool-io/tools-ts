import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly distanceLightyears: number;
  readonly availableYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "distanceLightyears", label: "Distance lightyears", kind: "number" },
  { id: "availableYears", label: "Available years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.distanceLightyears, "distance");
  positive(i.availableYears, "time");
  return { requiredFractionOfC: i.distanceLightyears / i.availableYears };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { distanceLightyears: 4, availableYears: 8 },
  output: { result: { requiredFractionOfC: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/fraction-of-c-requirement-converter",
  title: "Interstellar Ship Velocity Fraction-of-c Requirement Converter",
  description:
    "Required average v/c from lightyear distance and coordinate years; flags superluminal requests separately, not acceleration or propulsion design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { requiredFractionOfC: { type: "number" } },
        required: ["requiredFractionOfC"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
