import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const meanIonicActivityExample = {
  input: { gammaMinus: 0.8, gammaPlus: 0.9 },
} satisfies ToolExample<{
  readonly gammaMinus: number;
  readonly gammaPlus: number;
}>;

export const meanIonicActivityTool = createSimpleTool({
  id: "chemistry/mean-ionic-activity",
  title: "Mean Ionic Activity",
  description:
    "Compute the mean ionic activity coefficient for a 1:1 electrolyte as the square root of the cation and anion coefficient product.",
  inputs: [
    { id: "gammaPlus", label: "Cation activity coefficient", kind: "number" },
    { id: "gammaMinus", label: "Anion activity coefficient", kind: "number" },
  ],
  outputs: [
    {
      id: "meanActivityCoefficient",
      label: "Mean activity coefficient",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const gammaPlus = input.gammaPlus as number;
    const gammaMinus = input.gammaMinus as number;
    if (!(gammaPlus > 0))
      simpleError("gammaPlus", "Cation activity coefficient must be positive.");
    if (!(gammaMinus > 0))
      simpleError("gammaMinus", "Anion activity coefficient must be positive.");
    return { meanActivityCoefficient: Math.sqrt(gammaPlus * gammaMinus) };
  },
});
export const runMeanIonicActivity = meanIonicActivityTool.execute;
export default meanIonicActivityTool;
