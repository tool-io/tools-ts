import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly pressureAnomalyHpa: number;
  readonly waterDensityKgM3: number;
  readonly gravityMPerS2: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pressureAnomalyHpa", label: "Pressure anomaly hpa", kind: "number" },
  { id: "waterDensityKgM3", label: "Water density kg m3", kind: "number" },
  { id: "gravityMPerS2", label: "Gravity m per s2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.waterDensityKgM3, "density");
  positive(i.gravityMPerS2, "gravity");
  return {
    seaLevelAnomalyCm:
      (-10000 * i.pressureAnomalyHpa) / (i.waterDensityKgM3 * i.gravityMPerS2),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { pressureAnomalyHpa: 1, waterDensityKgM3: 1000, gravityMPerS2: 10 },
  output: { result: { seaLevelAnomalyCm: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/inverse-barometer-response-mb-cm",
  title: "Inverse Barometer Response MB CM Converter",
  description:
    "Hydrostatic inverse-barometer signed sea-level anomaly in cm; wind, dynamics and basin effects omitted.",
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
