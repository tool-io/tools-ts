import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const isoelectricPointExample = {
  input: { pKa1: 2.34, pKa2: 9.6 },
} satisfies ToolExample<{
  readonly pKa1: number;
  readonly pKa2: number;
}>;

export const isoelectricPointTool = createSimpleTool({
  id: "chemistry/isoelectric-point",
  title: "Isoelectric Point Calculator",
  description:
    "Compute the isoelectric point as the average of the two relevant pKa values.",
  inputs: [
    { id: "pKa1", label: "First pKa", kind: "number" },
    { id: "pKa2", label: "Second pKa", kind: "number" },
  ],
  outputs: [
    { id: "isoelectricPoint", label: "Isoelectric point pI", kind: "number" },
  ],
  calculate: (input) => ({
    isoelectricPoint: ((input.pKa1 as number) + (input.pKa2 as number)) / 2,
  }),
});
export const runIsoelectricPoint = isoelectricPointTool.execute;
export default isoelectricPointTool;
