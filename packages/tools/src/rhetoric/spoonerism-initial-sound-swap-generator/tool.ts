import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly firstOnset: string;
  readonly firstRime: string;
  readonly secondOnset: string;
  readonly secondRime: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstOnset", label: "First onset", kind: "string" },
  { id: "firstRime", label: "First rime", kind: "string" },
  { id: "secondOnset", label: "Second onset", kind: "string" },
  { id: "secondRime", label: "Second rime", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    [
      input.firstOnset,
      input.firstRime,
      input.secondOnset,
      input.secondRime,
    ].some((v) => !v || v.length > 64)
  )
    simpleError(
      "segments",
      "Nonempty independently identified onset/rime strings≤64 units, not automatic spelling/phoneme decomposition.",
    );
  return {
    firstSwappedForm: input.secondOnset + input.firstRime,
    secondSwappedForm: input.firstOnset + input.secondRime,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    firstOnset: "l",
    firstRime: "ight",
    secondOnset: "r",
    secondRime: "ain",
  },
  output: { result: { firstSwappedForm: "right", secondSwappedForm: "lain" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/spoonerism-initial-sound-swap-generator",
  title: "Spoonerism Initial Sound Swap Generator",
  description:
    "Swap caller independently identified onsets and retain rimes; constructed forms may not be real words or appropriate expressions.",
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
