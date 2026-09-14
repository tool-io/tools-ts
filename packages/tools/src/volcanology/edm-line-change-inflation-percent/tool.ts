import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly initialDistanceM: number;
  readonly observedDistanceM: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initialDistanceM", label: "Initial distance m", kind: "number" },
  { id: "observedDistanceM", label: "Observed distance m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.initialDistanceM, "initial");
  positive(i.observedDistanceM, "observed");
  return {
    signedDistanceChangePercent:
      (100 * (i.observedDistanceM - i.initialDistanceM)) / i.initialDistanceM,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { initialDistanceM: 100, observedDistanceM: 101 },
  output: { result: { signedDistanceChangePercent: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/edm-line-change-inflation-percent",
  title: "EDM Line Change Inflation Percent Calculator",
  description:
    "Signed observed EDM line-length percent change, not uniquely attributable inflation.",
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
