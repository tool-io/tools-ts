import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly firstMagnitude: number;
  readonly secondMagnitude: number;
}>;
export type Output = Readonly<{ readonly firstOverSecondFlux: number }>;
const inputFields = [
  { id: "firstMagnitude", label: "First magnitude", kind: "number" },
  { id: "secondMagnitude", label: "Second magnitude", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    firstOverSecondFlux:
      10 ** (0.4 * (input.secondMagnitude - input.firstMagnitude)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstMagnitude: 0,
  secondMagnitude: 5,
} satisfies Input;
export const exampleOutput = { firstOverSecondFlux: 100 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/magnitude-flux-ratio",
  title: "Magnitude Flux Ratio Calculator",
  description:
    "Same-passband magnitude contrast converts to first/second flux ratio; brighter smaller magnitude. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstOverSecondFlux",
      label: "First over second flux",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstMagnitude: value.firstMagnitude as number,
      secondMagnitude: value.secondMagnitude as number,
    }),
});
export const run = tool.execute;
export default tool;
