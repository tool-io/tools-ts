import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ne555MonostableTimeExample = {
  input: { capacitanceF: 0.000001, rOhms: 10000 },
  output: { pulseWidthSeconds: 0.011 },
} satisfies ToolExample<
  { readonly capacitanceF: number; readonly rOhms: number },
  { readonly pulseWidthSeconds: number }
>;

export const ne555MonostableTimeTool = createSimpleTool({
  calculate: (input) => {
    const r = input.rOhms as number;
    const c = input.capacitanceF as number;
    if (!(r > 0))
      simpleError(
        "rOhms",
        "Resistance must be positive.",
        "invalid_resistance",
      );
    if (!(c > 0))
      simpleError(
        "capacitanceF",
        "Capacitance must be positive.",
        "invalid_capacitance",
      );
    return { pulseWidthSeconds: 1.1 * r * c };
  },
  description:
    "Compute the monostable pulse width of an NE555 timer from the timing resistor and capacitor.",
  id: "electronics/ne555-monostable-time",
  inputs: [
    { id: "rOhms", kind: "number", label: "Timing resistor", unit: "Ω" },
    {
      id: "capacitanceF",
      kind: "number",
      label: "Timing capacitor",
      unit: "F",
    },
  ],
  outputs: [
    {
      id: "pulseWidthSeconds",
      kind: "number",
      label: "Pulse width",
      unit: "s",
    },
  ],
  title: "NE555 Monostable Time",
});
export const runNe555MonostableTime = ne555MonostableTimeTool.execute;
export default ne555MonostableTimeTool;
