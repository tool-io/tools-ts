import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const phFromPohExample = {
  input: { poh: 3 },
} satisfies ToolExample<{
  readonly poh: number;
}>;

export const phFromPohTool = createSimpleTool({
  id: "chemistry/ph-from-poh",
  title: "pH From pOH",
  description: "Compute pH as fourteen minus pOH.",
  inputs: [
    { id: "poh", label: "pOH", kind: "number", maximum: 14, minimum: 0 },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const poh = input.poh as number;
    return { ph: 14 - poh };
  },
});
export const runPhFromPoh = phFromPohTool.execute;
export default phFromPohTool;
