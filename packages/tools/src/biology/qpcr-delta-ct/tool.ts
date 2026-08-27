import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const qpcrDeltaCtExample = {
  input: { ctTarget: 25, ctReference: 22 },
} satisfies ToolExample<{
  readonly ctReference: number;
  readonly ctTarget: number;
}>;

export const qpcrDeltaCtTool = createSimpleTool({
  id: "biology/qpcr-delta-ct",
  title: "Delta CT",
  description:
    "Calculate the signed delta CT value by subtracting the reference Ct from the target Ct.",
  inputs: [
    { id: "ctTarget", label: "Target Ct", kind: "number", unit: "cycles" },
    {
      id: "ctReference",
      label: "Reference Ct",
      kind: "number",
      unit: "cycles",
    },
  ],
  outputs: [
    { id: "deltaCt", label: "Delta CT", kind: "number", unit: "cycles" },
  ],
  calculate: (input) => ({
    deltaCt: (input.ctTarget as number) - (input.ctReference as number),
  }),
});
export const runQpcrDeltaCt = qpcrDeltaCtTool.execute;
export default qpcrDeltaCtTool;
