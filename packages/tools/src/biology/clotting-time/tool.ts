import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const clottingTimeExample = {
  input: { ctSeconds: 150 },
  output: { clottingTimeSeconds: 150, normalRange: true },
} satisfies ToolExample<
  { readonly ctSeconds: number },
  {
    readonly clottingTimeSeconds: number;
    readonly normalRange: boolean;
  }
>;

export const clottingTimeTool = createSimpleTool({
  id: "biology/clotting-time",
  title: "Clotting Time Category",
  description:
    "Flag whether a clotting time between 30 and 600 seconds falls inside the normal range of 90 to 180 seconds inclusive.",
  inputs: [
    {
      id: "ctSeconds",
      label: "Clotting time",
      kind: "number",
      maximum: 600,
      minimum: 30,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "clottingTimeSeconds",
      label: "Clotting time",
      kind: "number",
      unit: "s",
    },
    { id: "normalRange", label: "Within normal range", kind: "boolean" },
  ],
  calculate: (input) => {
    const ctSeconds = input.ctSeconds as number;
    return {
      clottingTimeSeconds: ctSeconds,
      normalRange: ctSeconds >= 90 && ctSeconds <= 180,
    };
  },
});
export const runClottingTime = clottingTimeTool.execute;
export default clottingTimeTool;
