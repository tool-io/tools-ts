import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const powerFactorExample = {
  input: { impedanceOhms: 5, resistanceOhms: 3 },
} satisfies ToolExample<{
  readonly impedanceOhms: number;
  readonly resistanceOhms: number;
}>;

export const powerFactorTool = createSimpleTool({
  id: "electronics/power-factor",
  title: "Power Factor Calculator",
  description:
    "Calculate the power factor from resistance and impedance magnitude.",
  inputs: [
    { id: "resistanceOhms", label: "Resistance", kind: "number", unit: "ohm" },
    { id: "impedanceOhms", label: "Impedance", kind: "number", unit: "ohm" },
  ],
  outputs: [{ id: "powerFactor", label: "Power factor", kind: "number" }],
  calculate: (input) => {
    const impedanceOhms = input.impedanceOhms as number;
    if (impedanceOhms <= 0)
      simpleError("impedanceOhms", "Impedance must be positive.");
    return {
      powerFactor: (input.resistanceOhms as number) / impedanceOhms,
    };
  },
});
export const runPowerFactor = powerFactorTool.execute;
export default powerFactorTool;
