import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const boyleLawExample = {
  input: { pressure1: 100, volume1: 2, volume2: 4 },
} satisfies ToolExample<{
  readonly pressure1: number;
  readonly volume1: number;
  readonly volume2: number;
}>;

export const boyleLawTool = createSimpleTool({
  id: "chemistry/boyle-law",
  title: "Boyle's Law Calculator",
  description:
    "Compute the final pressure of a gas at constant temperature as initial pressure times initial volume over final volume.",
  inputs: [
    { id: "pressure1", label: "Initial pressure", kind: "number" },
    { id: "volume1", label: "Initial volume", kind: "number" },
    { id: "volume2", label: "Final volume", kind: "number" },
  ],
  outputs: [{ id: "pressure2", label: "Final pressure", kind: "number" }],
  calculate: (input) => {
    const pressure1 = input.pressure1 as number;
    const volume1 = input.volume1 as number;
    const volume2 = input.volume2 as number;
    if (!(pressure1 > 0))
      simpleError("pressure1", "Initial pressure must be positive.");
    if (!(volume1 > 0))
      simpleError("volume1", "Initial volume must be positive.");
    if (!(volume2 > 0))
      simpleError("volume2", "Final volume must be positive.");
    return { pressure2: (pressure1 * volume1) / volume2 };
  },
});
export const runBoyleLaw = boyleLawTool.execute;
export default boyleLawTool;
