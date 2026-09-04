import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentlyModeledBackCompressionN: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedNamedCompressionReservesN: readonly number[];
  readonly aboveNamed3400Indices: readonly number[];
}>;
const inputFields = [
  {
    id: "independentlyModeledBackCompressionN",
    label: "Independently modeled back compression n",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentlyModeledBackCompressionN.forEach((v) =>
    nonnegative(v, "independentlyModeledBackCompressionN"),
  );
  return {
    signedNamedCompressionReservesN:
      input.independentlyModeledBackCompressionN.map((v) => 3400 - v),
    aboveNamed3400Indices: input.independentlyModeledBackCompressionN.flatMap(
      (v, i) => (v > 3400 ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyModeledBackCompressionN: [3000, 4000],
} satisfies Input;
export const exampleOutput = {
  signedNamedCompressionReservesN: [400, -600],
  aboveNamed3400Indices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/back-compression-limit-checker",
  title: "Back Compressive Force Limit NIOSH 3400 N Checker",
  description:
    "Compare independently computed back compression to named3400Nreference; not RNLE load limit or approved individual spinal tolerance. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedNamedCompressionReservesN",
      label: "Signed named compression reserves n",
      kind: "numberList",
    },
    {
      id: "aboveNamed3400Indices",
      label: "Above named3400 indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyModeledBackCompressionN:
        value.independentlyModeledBackCompressionN as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
