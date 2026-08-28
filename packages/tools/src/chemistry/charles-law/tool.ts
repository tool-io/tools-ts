import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const charlesLawExample = {
  input: { temperature1: 273.15, temperature2: 546.3, volume1: 1 },
} satisfies ToolExample<{
  readonly temperature1: number;
  readonly temperature2: number;
  readonly volume1: number;
}>;

export const charlesLawTool = createSimpleTool({
  id: "chemistry/charles-law",
  title: "Charles's Law Calculator",
  description:
    "Compute the final volume of a gas at constant pressure as initial volume times final temperature over initial temperature in Kelvin.",
  inputs: [
    { id: "volume1", label: "Initial volume", kind: "number" },
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
  outputs: [{ id: "volume2", label: "Final volume", kind: "number" }],
  calculate: (input) => {
    const volume1 = input.volume1 as number;
    const temperature1 = input.temperature1 as number;
    const temperature2 = input.temperature2 as number;
    if (!(volume1 > 0))
      simpleError("volume1", "Initial volume must be positive.");
    if (!(temperature1 > 0))
      simpleError("temperature1", "Initial temperature must be positive.");
    if (!(temperature2 > 0))
      simpleError("temperature2", "Final temperature must be positive.");
    return { volume2: (volume1 * temperature2) / temperature1 };
  },
});
export const runCharlesLaw = charlesLawTool.execute;
export default charlesLawTool;
