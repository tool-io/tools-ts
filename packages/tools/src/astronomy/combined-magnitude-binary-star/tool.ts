import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly firstMagnitude: number;
  readonly secondMagnitude: number;
}>;
export type Output = Readonly<{ readonly combinedMagnitude: number }>;
const inputFields = [
  { id: "firstMagnitude", label: "First magnitude", kind: "number" },
  { id: "secondMagnitude", label: "Second magnitude", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = Math.min(input.firstMagnitude, input.secondMagnitude);
  return {
    combinedMagnitude:
      m -
      2.5 *
        Math.log10(
          1 +
            10 **
              (-0.4 * Math.abs(input.firstMagnitude - input.secondMagnitude)),
        ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstMagnitude: 5,
  secondMagnitude: 5,
} satisfies Input;
export const exampleOutput = {
  combinedMagnitude: 4.247425010840047,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/combined-magnitude-binary-star",
  title: "Combined Binary Star Magnitude Calculator",
  description:
    "Stable additive same-passband unresolved binary magnitude; no magnitude arithmetic average. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "combinedMagnitude", label: "Combined magnitude", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      firstMagnitude: value.firstMagnitude as number,
      secondMagnitude: value.secondMagnitude as number,
    }),
});
export const run = tool.execute;
export default tool;
