import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly countedCocoons: number;
  readonly sampledMassKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "countedCocoons", label: "Counted cocoons", kind: "number" },
  { id: "sampledMassKg", label: "Sampled mass kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.countedCocoons, "count", 0, 1000000000);
  positive(i.sampledMassKg, "mass");
  return { observedCocoonsPerKg: i.countedCocoons / i.sampledMassKg };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { countedCocoons: 200, sampledMassKg: 0.5 },
  output: { result: { observedCocoonsPerKg: 400 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/cocoons-per-kg-count-average",
  title: "Cocoons Per KG Count Average Lookup",
  description:
    "Actual sampled cocoon number per kg; does not invent a breed-independent average.",
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
