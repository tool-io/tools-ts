import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const combinedGasLawExample = {
  input: {
    pressure1: 100,
    temperature1: 300,
    temperature2: 600,
    volume1: 6,
    volume2: 3,
  },
} satisfies ToolExample<{
  readonly pressure1: number;
  readonly temperature1: number;
  readonly temperature2: number;
  readonly volume1: number;
  readonly volume2: number;
}>;

export const combinedGasLawTool = createSimpleTool({
  id: "chemistry/combined-gas-law",
  title: "Combined Gas Law Calculator",
  description:
    "Compute final pressure as initial pressure times initial volume over final volume times final temperature over initial temperature in Kelvin.",
  inputs: [
    { id: "pressure1", label: "Initial pressure", kind: "number" },
    { id: "volume1", label: "Initial volume", kind: "number" },
    { id: "volume2", label: "Final volume", kind: "number" },
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
    const volume1 = input.volume1 as number;
    const volume2 = input.volume2 as number;
    const temperature1 = input.temperature1 as number;
    const temperature2 = input.temperature2 as number;
    if (!(pressure1 > 0))
      simpleError("pressure1", "Initial pressure must be positive.");
    if (!(volume1 > 0))
      simpleError("volume1", "Initial volume must be positive.");
    if (!(volume2 > 0))
      simpleError("volume2", "Final volume must be positive.");
    if (!(temperature1 > 0))
      simpleError("temperature1", "Initial temperature must be positive.");
    if (!(temperature2 > 0))
      simpleError("temperature2", "Final temperature must be positive.");
    return {
      pressure2:
        pressure1 * (volume1 / volume2) * (temperature2 / temperature1),
    };
  },
});
export const runCombinedGasLaw = combinedGasLawTool.execute;
export default combinedGasLawTool;
