import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{ readonly seedDiameterMm: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seedDiameterMm", label: "Seed diameter mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.seedDiameterMm, "diameter");
  return { heuristicDepthMm: 2 * i.seedDiameterMm };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { seedDiameterMm: 3 },
  output: { result: { heuristicDepthMm: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/seed-depth-2x-rule-lookup",
  title: "Seed Depth 2X Rule Lookup",
  description:
    "Illustrative twice-diameter planting-depth heuristic only; species/light/germination requirements override it.",
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
