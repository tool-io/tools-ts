import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sequence,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly phi5: number;
  readonly phi25: number;
  readonly phi75: number;
  readonly phi95: number;
}>;
export type Output = Readonly<{ readonly graphicKurtosis: number }>;
const inputFields = [
  { id: "phi5", label: "Phi5", kind: "number" },
  { id: "phi25", label: "Phi25", kind: "number" },
  { id: "phi75", label: "Phi75", kind: "number" },
  { id: "phi95", label: "Phi95", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  sequence([input.phi5, input.phi25, input.phi75, input.phi95], "quantiles");
  return {
    graphicKurtosis:
      (input.phi95 - input.phi5) /
      (2.44 * positive(input.phi75 - input.phi25, "interquartile spread")),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phi5: -2,
  phi25: -1,
  phi75: 1,
  phi95: 2,
} satisfies Input;
export const exampleOutput = {
  graphicKurtosis: 0.819672131147541,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/kurtosis-folk-ward",
  title: "Geology Kurtosis Folk Ward Calculator",
  description:
    "Folk–Ward tail/interquartile PHI spread ratio, not moment kurtosis. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "graphicKurtosis", label: "Graphic kurtosis", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      phi5: value.phi5 as number,
      phi25: value.phi25 as number,
      phi75: value.phi75 as number,
      phi95: value.phi95 as number,
    }),
});
export const run = tool.execute;
export default tool;
