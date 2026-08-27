import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const qpcrDeltaDeltaCtExample = {
  input: { deltaCtControl: 3, deltaCtTreated: 1 },
} satisfies ToolExample<{
  readonly deltaCtControl: number;
  readonly deltaCtTreated: number;
}>;

export const qpcrDeltaDeltaCtTool = createSimpleTool({
  id: "biology/qpcr-delta-delta-ct",
  title: "Delta Delta CT",
  description:
    "Calculate the delta delta CT value by subtracting the control delta CT from the treated delta CT.",
  inputs: [
    {
      id: "deltaCtTreated",
      label: "Treated delta CT",
      kind: "number",
      unit: "cycles",
    },
    {
      id: "deltaCtControl",
      label: "Control delta CT",
      kind: "number",
      unit: "cycles",
    },
  ],
  outputs: [
    {
      id: "deltaDeltaCt",
      label: "Delta delta CT",
      kind: "number",
      unit: "cycles",
    },
  ],
  calculate: (input) => ({
    deltaDeltaCt:
      (input.deltaCtTreated as number) - (input.deltaCtControl as number),
  }),
});
export const runQpcrDeltaDeltaCt = qpcrDeltaDeltaCtTool.execute;
export default qpcrDeltaDeltaCtTool;
