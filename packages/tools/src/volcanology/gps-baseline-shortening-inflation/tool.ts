import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly initialBaselineM: number;
  readonly finalBaselineM: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initialBaselineM", label: "Initial baseline m", kind: "number" },
  { id: "finalBaselineM", label: "Final baseline m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.initialBaselineM, "initial");
  positive(i.finalBaselineM, "final");
  return { signedShorteningM: i.initialBaselineM - i.finalBaselineM };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { initialBaselineM: 100, finalBaselineM: 99 },
  output: { result: { signedShorteningM: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/gps-baseline-shortening-inflation",
  title: "GPS Baseline Shortening Inflation Calculator",
  description:
    "Signed measured GPS baseline shortening; negative lengthening preserved, no volcano-source inversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
