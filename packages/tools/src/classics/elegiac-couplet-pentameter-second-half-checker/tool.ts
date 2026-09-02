import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyScannedSecondHalf: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyScannedSecondHalf",
    label: "Independently scanned second half",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!/^[ux-]{1,16}$/.test(input.independentlyScannedSecondHalf))
    simpleError(
      "scan",
      "Explicit independently scanned short, long, final anceps token string.",
    );
  return {
    matchesRestrictedPentameterSecondHalf: /^-uu-uu[ux-]$/.test(
      input.independentlyScannedSecondHalf,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyScannedSecondHalf: "-uu-uux" },
  output: { result: { matchesRestrictedPentameterSecondHalf: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/elegiac-couplet-pentameter-second-half-checker",
  title: "Elegiac Couplet Pentameter Second Half Checker",
  description:
    "Check restricted pentameter second hemiepes two dactyls plus final syllable; caller establishes diaeresis and quantities, no syllabification or whole couplet validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
