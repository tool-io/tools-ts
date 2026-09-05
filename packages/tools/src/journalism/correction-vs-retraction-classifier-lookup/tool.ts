import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyDeterminedRemedy: string;
}>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  {
    id: "independentlyDeterminedRemedy",
    label: "Independently determined remedy",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.independentlyDeterminedRemedy,
      {
        "correctable-error":
          "correction: repair specific independently established errors while preserving an accurate record",
        "fundamental-unreliability":
          "retraction: withdraw fundamentally unreliable publication under the applicable editorial policy",
        uncertain:
          "escalate for editorial review; evidence does not yet determine correction or retraction",
      },
      "independentlyDeterminedRemedy",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyDeterminedRemedy: "correctable-error",
} satisfies Input;
export const exampleOutput = {
  meaning:
    "correction: repair specific independently established errors while preserving an accurate record",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/correction-vs-retraction-classifier-lookup",
  title: "Correction vs Retraction Classifier Lookup",
  description:
    "Map independently determined error scope to named editorial remedy, not infer facts, intent or legal obligations from copy. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({
      independentlyDeterminedRemedy:
        value.independentlyDeterminedRemedy as string,
    }),
});
export const run = tool.execute;
export default tool;
