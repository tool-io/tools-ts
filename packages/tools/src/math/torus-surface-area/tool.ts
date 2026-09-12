import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMajorRadius: number;
  readonly actualTubeRadius: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMajorRadius", label: "Actual major radius", kind: "number" },
  { id: "actualTubeRadius", label: "Actual tube radius", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualMajorRadius, "actualMajorRadius");
  positive(input.actualTubeRadius, "actualTubeRadius");
  if (input.actualMajorRadius <= input.actualTubeRadius)
    simpleError("ring", "R>r>0.");
  return {
    value: 4 * Math.PI ** 2 * input.actualMajorRadius * input.actualTubeRadius,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMajorRadius: 2, actualTubeRadius: 1 },
  output: { result: { value: 78.95683520871486 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/torus-surface-area",
  title: "Torus Surface Area Calculator",
  description:
    "Ring torus area4\u03c0\u00b2Rr, actualR>r>0, no spindle/horn overlap or volume.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
