import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMatchedCsfConcentration: number;
  readonly actualMatchedPlasmaConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMatchedCsfConcentration",
    label: "Actual matched csf concentration",
    kind: "number",
  },
  {
    id: "actualMatchedPlasmaConcentration",
    label: "Actual matched plasma concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualMatchedCsfConcentration,
    "actualMatchedCsfConcentration",
  );
  positive(
    input.actualMatchedPlasmaConcentration,
    "actualMatchedPlasmaConcentration",
  );
  return {
    value:
      (1 * input.actualMatchedCsfConcentration) /
      input.actualMatchedPlasmaConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMatchedCsfConcentration: 2,
    actualMatchedPlasmaConcentration: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/csf-plasma-ratio",
  title: "CSF Plasma Ratio Calculator",
  description:
    "Actual same basis CSF/plasma exposure partition, not brain homogenate partition; actual compatible definitions and matching units required, no causal efficacy/diagnosis or safety claim.",
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
