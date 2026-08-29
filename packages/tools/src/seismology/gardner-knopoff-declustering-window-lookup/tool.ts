import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const gardnerKnopoffDeclusteringWindowLookupExample = {
  input: { mainshockMagnitudeMw: 6.2 },
  output: { distanceWindowKm: 60, timeWindowDays: 548 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const gardnerKnopoffDeclusteringWindowLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ mainshockMagnitudeMw }) => {
      const bands = [
        { maxM: 4.0, km: 15, days: 42 },
        { maxM: 5.0, km: 30, days: 183 },
        { maxM: 5.5, km: 40, days: 365 },
        { maxM: 6.0, km: 50, days: 365 },
        { maxM: 6.5, km: 60, days: 548 },
        { maxM: 7.0, km: 75, days: 730 },
        { maxM: 7.5, km: 120, days: 1095 },
        { maxM: Infinity, km: 180, days: 1460 },
      ];
      const b = bands.find((x) => mainshockMagnitudeMw < x.maxM)!;
      return { distanceWindowKm: b.km, timeWindowDays: b.days };
    })(input as never) as Record<string, unknown>,
  description:
    "Gardner-Knopoff space window by mainshock magnitude for catalog declustering.",
  id: "seismology/gardner-knopoff-declustering-window-lookup",
  inputs: [
    {
      description: "Mainshock magnitude.",
      id: "mainshockMagnitudeMw",
      kind: "number",
      label: "M",
    },
  ],
  outputs: [
    {
      description: "Space window radius.",
      id: "distanceWindowKm",
      kind: "number",
      label: "R_w",
      unit: "km",
    },
    {
      description: "Time window length.",
      id: "timeWindowDays",
      kind: "number",
      label: "T_w",
      unit: "d",
    },
  ],
  title: "Gardner Knopoff Declustering Window Lookup",
});
export const runGardnerKnopoffDeclusteringWindowLookup =
  gardnerKnopoffDeclusteringWindowLookupTool.execute;
export { gardnerKnopoffDeclusteringWindowLookupExample as example };
export default gardnerKnopoffDeclusteringWindowLookupTool;
