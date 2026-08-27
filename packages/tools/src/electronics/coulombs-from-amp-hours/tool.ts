import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const coulombsFromAmpHoursExample = {
  input: { ampHours: 2 },
  output: { chargeCoulombs: 7200 },
} satisfies ToolExample<
  { readonly ampHours: number },
  { readonly chargeCoulombs: number }
>;

export const coulombsFromAmpHoursTool = createSimpleTool({
  calculate: (input) => ({
    chargeCoulombs: (input.ampHours as number) * 3600,
  }),
  description: "Convert battery charge in amp-hours to coulombs.",
  id: "electronics/coulombs-from-amp-hours",
  inputs: [
    {
      id: "ampHours",
      kind: "number",
      label: "Charge",
      minimum: 0,
      unit: "Ah",
    },
  ],
  outputs: [
    { id: "chargeCoulombs", kind: "number", label: "Charge", unit: "C" },
  ],
  title: "Coulombs From Ah",
});
export const runCoulombsFromAmpHours = coulombsFromAmpHoursTool.execute;
export default coulombsFromAmpHoursTool;
