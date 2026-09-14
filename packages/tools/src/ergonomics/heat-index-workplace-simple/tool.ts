import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly naturalWetBulbC: number;
  readonly globeC: number;
  readonly dryBulbC: number;
  readonly outdoorSolarFlag: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "naturalWetBulbC", label: "Natural wet bulb c", kind: "number" },
  { id: "globeC", label: "Globe c", kind: "number" },
  { id: "dryBulbC", label: "Dry bulb c", kind: "number" },
  { id: "outdoorSolarFlag", label: "Outdoor solar flag", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.outdoorSolarFlag, "solar flag", 0, 1);
  return {
    measuredWbgtC:
      i.outdoorSolarFlag === 1
        ? 0.7 * i.naturalWetBulbC + 0.2 * i.globeC + 0.1 * i.dryBulbC
        : 0.7 * i.naturalWetBulbC + 0.3 * i.globeC,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { naturalWetBulbC: 20, globeC: 30, dryBulbC: 25, outdoorSolarFlag: 1 },
  output: { result: { measuredWbgtC: 22.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/heat-index-workplace-simple",
  title: "WBGT-Style Heat Stress Simplified Index Calculator",
  description:
    "WBGT arithmetic from actual natural wet-bulb and globe measurements, not a substitute using humidity/air temperature or exposure authorization.",
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
