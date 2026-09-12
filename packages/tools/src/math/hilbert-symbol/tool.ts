import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFirstRealNonzero: number;
  readonly actualSecondRealNonzero: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFirstRealNonzero",
    label: "Actual first real nonzero",
    kind: "number",
  },
  {
    id: "actualSecondRealNonzero",
    label: "Actual second real nonzero",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.actualFirstRealNonzero === 0 || input.actualSecondRealNonzero === 0)
    simpleError("arguments", "Actualnonzerorealnumbers.");
  return {
    realPlaceHilbertSymbol:
      input.actualFirstRealNonzero < 0 && input.actualSecondRealNonzero < 0
        ? -1
        : 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFirstRealNonzero: 1, actualSecondRealNonzero: -2 },
  output: { result: { realPlaceHilbertSymbol: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/hilbert-symbol",
  title: "Hilbert Symbol Calculator",
  description:
    "Restricted realplaceHilbertsymbol(a, b)_infinity,\u22121iffbothnegative; NOT finitep-adicsymbol. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
