import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const sclerotiumSizeClassRaterExample = {
  input: {
    largeMinimumMm: 20.1,
    mediumMinimumMm: 5.1,
    microsclerotiumMaximumMm: 0.49,
    diameterMm: 12,
  },
  output: { sclerotiumSizeClass: "medium" },
} satisfies ToolExample<
  {
    readonly diameterMm: number;
    readonly largeMinimumMm: number;
    readonly mediumMinimumMm: number;
    readonly microsclerotiumMaximumMm: number;
  },
  { readonly sclerotiumSizeClass: string }
>;

export const sclerotiumSizeClassRaterTool = createSimpleTool({
  id: "mycology/sclerotium-size-class-rater",
  title: "Sclerotium Size Class",
  description:
    "Classify sclerotium diameter using caller-supplied size boundaries appropriate to the species and measurement protocol.",
  inputs: [
    {
      id: "diameterMm",
      kind: "number",
      label: "Diameter",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      id: "microsclerotiumMaximumMm",
      kind: "number",
      label: "Microsclerotium maximum",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      id: "mediumMinimumMm",
      kind: "number",
      label: "Medium minimum",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      id: "largeMinimumMm",
      kind: "number",
      label: "Large minimum",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
  ],
  outputs: [
    {
      enum: ["microsclerotium", "small", "medium", "large"],
      id: "sclerotiumSizeClass",
      kind: "string",
      label: "Sclerotium size class",
    },
  ],
  calculate: (input) => {
    const diameterMm = input.diameterMm as number;
    const microsclerotiumMaximumMm = input.microsclerotiumMaximumMm as number;
    const mediumMinimumMm = input.mediumMinimumMm as number;
    const largeMinimumMm = input.largeMinimumMm as number;
    if (!(
      microsclerotiumMaximumMm < mediumMinimumMm &&
      mediumMinimumMm < largeMinimumMm
    ))
      simpleError(
        "largeMinimumMm",
        "Sclerotium size boundaries must increase strictly.",
      );
    const sclerotiumSizeClass =
      diameterMm <= microsclerotiumMaximumMm
        ? "microsclerotium"
        : diameterMm < mediumMinimumMm
          ? "small"
          : diameterMm < largeMinimumMm
            ? "medium"
            : "large";
    return { sclerotiumSizeClass };
  },
});
export const runSclerotiumSizeClassRater = sclerotiumSizeClassRaterTool.execute;
export default sclerotiumSizeClassRaterTool;
