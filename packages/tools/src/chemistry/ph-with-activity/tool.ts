import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const phWithActivityExample = {
  input: { gamma: 0.8, hConcM: 0.001 },
} satisfies ToolExample<{
  readonly gamma: number;
  readonly hConcM: number;
}>;

export const phWithActivityTool = createSimpleTool({
  id: "chemistry/ph-with-activity",
  title: "pH With Activity",
  description:
    "Compute pH from the hydrogen ion activity as the negative log10 of the activity coefficient times the hydrogen ion concentration.",
  inputs: [
    { id: "gamma", label: "Activity coefficient", kind: "number" },
    {
      id: "hConcM",
      label: "Hydrogen ion concentration",
      kind: "number",
      unit: "M",
    },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const gamma = input.gamma as number;
    const hConcM = input.hConcM as number;
    if (!(gamma > 0))
      simpleError("gamma", "Activity coefficient must be positive.");
    if (!(hConcM > 0))
      simpleError("hConcM", "Hydrogen ion concentration must be positive.");
    return { ph: -Math.log10(gamma * hConcM) };
  },
});
export const runPhWithActivity = phWithActivityTool.execute;
export default phWithActivityTool;
