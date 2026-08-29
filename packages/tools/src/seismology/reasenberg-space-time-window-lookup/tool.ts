import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const reasenbergSpaceTimeWindowLookupExample = {
  input: { seedEventMagnitudeMw: 4.6 },
  output: { interactionRadiusKm: 12, lookAheadDays: 5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const reasenbergSpaceTimeWindowLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ seedEventMagnitudeMw }) => {
      const base =
        seedEventMagnitudeMw >= 6
          ? { r: 30, t: 15 }
          : seedEventMagnitudeMw >= 5
            ? { r: 20, t: 10 }
            : seedEventMagnitudeMw >= 4
              ? { r: 12, t: 5 }
              : { r: 8, t: 3 };
      return { interactionRadiusKm: base.r, lookAheadDays: base.t };
    })(input as never) as Record<string, unknown>,
  description:
    "Reasenberg-cluster linkage parameters (interaction radius and look-ahead time) by magnitude class.",
  id: "seismology/reasenberg-space-time-window-lookup",
  inputs: [
    {
      description: "Seed event magnitude.",
      id: "seedEventMagnitudeMw",
      kind: "number",
      label: "M",
    },
  ],
  outputs: [
    {
      description: "Cluster interaction radius.",
      id: "interactionRadiusKm",
      kind: "number",
      label: "D₂",
      unit: "km",
    },
    {
      description: "Look-ahead time for the next linked event.",
      id: "lookAheadDays",
      kind: "number",
      label: "τ",
      unit: "d",
    },
  ],
  title: "Reasenberg Space Time Window Lookup",
});
export const runReasenbergSpaceTimeWindowLookup =
  reasenbergSpaceTimeWindowLookupTool.execute;
export { reasenbergSpaceTimeWindowLookupExample as example };
export default reasenbergSpaceTimeWindowLookupTool;
