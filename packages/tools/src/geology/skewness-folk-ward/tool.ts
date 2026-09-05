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
  readonly phi16: number;
  readonly phi50: number;
  readonly phi84: number;
  readonly phi95: number;
}>;
export type Output = Readonly<{ readonly graphicSkewness: number }>;
const inputFields = [
  { id: "phi5", label: "Phi5", kind: "number" },
  { id: "phi16", label: "Phi16", kind: "number" },
  { id: "phi50", label: "Phi50", kind: "number" },
  { id: "phi84", label: "Phi84", kind: "number" },
  { id: "phi95", label: "Phi95", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  sequence(
    [input.phi5, input.phi16, input.phi50, input.phi84, input.phi95],
    "quantiles",
  );
  const a = positive(input.phi84 - input.phi16, "central spread"),
    b = positive(input.phi95 - input.phi5, "tail spread");
  return {
    graphicSkewness:
      (input.phi16 + input.phi84 - 2 * input.phi50) / (2 * a) +
      (input.phi5 + input.phi95 - 2 * input.phi50) / (2 * b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phi5: -2,
  phi16: -1,
  phi50: 0,
  phi84: 2,
  phi95: 4,
} satisfies Input;
export const exampleOutput = {
  graphicSkewness: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/skewness-folk-ward",
  title: "Geology Skewness Folk Ward Calculator",
  description:
    "Folk–Ward normalized central and tail PHI asymmetry, not moment skew. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "graphicSkewness", label: "Graphic skewness", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      phi5: value.phi5 as number,
      phi16: value.phi16 as number,
      phi50: value.phi50 as number,
      phi84: value.phi84 as number,
      phi95: value.phi95 as number,
    }),
});
export const run = tool.execute;
export default tool;
