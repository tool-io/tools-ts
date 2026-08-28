import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const gayLussacLawExample = {
  input: { pressure1: 101.325, temperature1: 273.15, temperature2: 546.3 },
} satisfies ToolExample<{
  readonly pressure1: number;
  readonly temperature1: number;
  readonly temperature2: number;
}>;

export const gayLussacLawTool = createSimpleTool({
  id: "chemistry/gay-lussac-law",
  title: "Gay-Lussac Law Calculator",
  description:
    "Compute the final pressure of a gas at constant volume as initial pressure times final temperature over initial temperature in Kelvin.",
  inputs: [
    { id: "pressure1", label: "Initial pressure", kind: "number" },
    {
      id: "temperature1",
      label: "Initial temperature",
      kind: "number",
      unit: "K",
    },
    {
      id: "temperature2",
      label: "Final temperature",
      kind: "number",
      unit: "K",
    },
  ],
  outputs: [{ id: "pressure2", label: "Final pressure", kind: "number" }],
  calculate: (input) => {
    const pressure1 = input.pressure1 as number;
    const temperature1 = input.temperature1 as number;
    const temperature2 = input.temperature2 as number;
    if (!(pressure1 > 0))
      simpleError("pressure1", "Initial pressure must be positive.");
    if (!(temperature1 > 0))
      simpleError("temperature1", "Initial temperature must be positive.");
    if (!(temperature2 > 0))
      simpleError("temperature2", "Final temperature must be positive.");
    return { pressure2: (pressure1 * temperature2) / temperature1 };
  },
});
export const runGayLussacLaw = gayLussacLawTool.execute;
export default gayLussacLawTool;
