import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const ampHoursFromCoulombsExample = {
  input: { coulombs: 7200 },
  output: { ampHours: 2 },
} satisfies ToolExample<
  { readonly coulombs: number },
  { readonly ampHours: number }
>;

export const ampHoursFromCoulombsTool = createSimpleTool({
  calculate: (input) => ({ ampHours: (input.coulombs as number) / 3600 }),
  description: "Convert charge in coulombs to battery capacity in amp-hours.",
  id: "electronics/amp-hours-from-coulombs",
  inputs: [{ id: "coulombs", kind: "number", label: "Charge", unit: "C" }],
  outputs: [{ id: "ampHours", kind: "number", label: "Capacity", unit: "Ah" }],
  title: "Ah From Coulombs",
});
export const runAmpHoursFromCoulombs = ampHoursFromCoulombsTool.execute;
export default ampHoursFromCoulombsTool;
