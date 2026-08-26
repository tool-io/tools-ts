import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const vacuumPressPressureExample = {
  input: { vacuumPercent: 50 },
  output: { absolutePressureBar: 0.5 },
} satisfies ToolExample<
  { readonly vacuumPercent: number },
  { readonly absolutePressureBar: number }
>;

export const vacuumPressPressureTool = createSimpleTool({
  id: "carpentry/vakuumpresse-druck",
  title: "Vacuum Press Pressure Calculator",
  description:
    "Compute absolute pressure in bar from the achieved vacuum percentage.",
  inputs: [
    {
      description:
        "Achieved vacuum as a percentage below atmospheric pressure.",
      id: "vacuumPercent",
      kind: "number",
      label: "Vacuum",
      maximum: 95,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Absolute clamping pressure in bar.",
      id: "absolutePressureBar",
      kind: "number",
      label: "Absolute pressure",
      unit: "bar",
    },
  ],
  calculate: (input) => ({
    absolutePressureBar: 1 - (input.vacuumPercent as number) / 100,
  }),
});
export const runVacuumPressPressure = vacuumPressPressureTool.execute;
export default vacuumPressPressureTool;
