import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const liquefactionFeatureMagnitudeBoundLookupExample = {
  input: { epicentralDistanceKm: 100 },
  output: {
    minimumMagnitudeMw: 7.6,
    fieldNote:
      "Features below this bound imply a larger or nearer source than assumed.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const liquefactionFeatureMagnitudeBoundLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ epicentralDistanceKm }) => ({
      minimumMagnitudeMw:
        5.0 + 1.3 * Math.log10(Math.max(epicentralDistanceKm, 1)),
      fieldNote:
        "Features below this bound imply a larger or nearer source than assumed.",
    }))(input as never) as Record<string, unknown>,
  description:
    "Ambraseys-style minimum magnitude bound for liquefaction at a given epicentral distance.",
  id: "seismology/liquefaction-feature-magnitude-bound-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Distance from the source.",
      id: "epicentralDistanceKm",
      kind: "number",
      label: "R",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Smallest magnitude capable of liquefaction at R.",
      id: "minimumMagnitudeMw",
      kind: "number",
      label: "M_min",
    },
    {
      description: "Interpretation of the bound.",
      id: "fieldNote",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Liquefaction Feature Magnitude Bound Lookup",
});
export const runLiquefactionFeatureMagnitudeBoundLookup =
  liquefactionFeatureMagnitudeBoundLookupTool.execute;
export { liquefactionFeatureMagnitudeBoundLookupExample as example };
export default liquefactionFeatureMagnitudeBoundLookupTool;
