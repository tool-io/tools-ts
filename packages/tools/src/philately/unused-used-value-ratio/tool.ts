import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, money } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly unusedValueMinor: number;
  readonly usedValueMinor: number;
}>;
export type Output = Readonly<{ readonly unusedToUsedRatio: number }>;
const inputFields = [
  { id: "unusedValueMinor", label: "Unused value minor", kind: "number" },
  { id: "usedValueMinor", label: "Used value minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.unusedValueMinor, "unused");
  money(input.usedValueMinor, "used");
  positive(input.usedValueMinor, "used");
  return { unusedToUsedRatio: input.unusedValueMinor / input.usedValueMinor };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unusedValueMinor: 1500,
  usedValueMinor: 500,
} satisfies Input;
export const exampleOutput = { unusedToUsedRatio: 3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/unused-used-value-ratio",
  title: "Unused versus Used Value Ratio Comparator",
  description:
    "Compare caller same-edition, same-currency unused/used values without treating catalogue ratios as sale prices. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "unusedToUsedRatio", label: "Unused to used ratio", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      unusedValueMinor: value.unusedValueMinor as number,
      usedValueMinor: value.usedValueMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
