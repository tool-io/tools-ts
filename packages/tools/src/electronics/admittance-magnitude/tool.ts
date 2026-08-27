import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const admittanceMagnitudeExample = {
  input: { conductanceS: 3, susceptanceS: 4 },
} satisfies ToolExample<{
  readonly conductanceS: number;
  readonly susceptanceS: number;
}>;

export const admittanceMagnitudeTool = createSimpleTool({
  id: "electronics/admittance-magnitude",
  title: "Admittance Magnitude",
  description:
    "Calculate the magnitude of admittance from conductance and susceptance.",
  inputs: [
    { id: "conductanceS", label: "Conductance", kind: "number", unit: "S" },
    { id: "susceptanceS", label: "Susceptance", kind: "number", unit: "S" },
  ],
  outputs: [
    {
      id: "admittanceSiemens",
      label: "Admittance magnitude",
      kind: "number",
      unit: "S",
    },
  ],
  calculate: (input) => ({
    admittanceSiemens: Math.hypot(
      input.conductanceS as number,
      input.susceptanceS as number,
    ),
  }),
});
export const runAdmittanceMagnitude = admittanceMagnitudeTool.execute;
export default admittanceMagnitudeTool;
