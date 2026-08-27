import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const workOfBreathingExample = {
  input: { pressureCmh2o: 10 },
  output: { workOfBreathingJPerL: 0.9810000000000001 },
} satisfies ToolExample<
  { readonly pressureCmh2o: number },
  { readonly workOfBreathingJPerL: number }
>;

export const workOfBreathingTool = createSimpleTool({
  id: "biology/work-of-breathing",
  title: "Work Of Breathing",
  description:
    "Convert a ventilatory pressure into mechanical work per liter of ventilation using the 0.0981 J/L per cmH2O factor.",
  inputs: [
    {
      id: "pressureCmh2o",
      label: "Pressure",
      kind: "number",
      minimum: 0,
      unit: "cmH2O",
    },
  ],
  outputs: [
    {
      id: "workOfBreathingJPerL",
      label: "Work of breathing",
      kind: "number",
      unit: "J/L",
    },
  ],
  calculate: (input) => ({
    workOfBreathingJPerL: (input.pressureCmh2o as number) * 0.0981,
  }),
});
export const runWorkOfBreathing = workOfBreathingTool.execute;
export default workOfBreathingTool;
