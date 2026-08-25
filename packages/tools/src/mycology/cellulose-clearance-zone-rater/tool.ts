import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CelluloseClearanceZoneRaterInput = {
  readonly moderateMinimumMm: number;
  readonly strongMinimumMm: number;
  readonly zoneMm: number;
};

export type CelluloseClearanceZoneRaterOutput = {
  readonly clearanceRating: string;
};

export const celluloseClearanceZoneRaterExample = {
  input: { moderateMinimumMm: 5, strongMinimumMm: 15.1, zoneMm: 12 },
  output: { clearanceRating: "moderate" },
} satisfies ToolExample<
  CelluloseClearanceZoneRaterInput,
  CelluloseClearanceZoneRaterOutput
>;

export const celluloseClearanceZoneRaterTool = createSimpleTool({
  id: "mycology/cellulose-clearance-zone-rater",
  title: "Clearance Zone Rater",
  description:
    "Rate a cellulose-clearance zone using thresholds supplied for the assay protocol; category cutoffs vary with media, organism, and incubation conditions.",
  inputs: [
    {
      id: "zoneMm",
      kind: "number",
      label: "Clearance zone",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "moderateMinimumMm",
      kind: "number",
      label: "Moderate minimum",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      id: "strongMinimumMm",
      kind: "number",
      label: "Strong minimum",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
  ],
  outputs: [
    {
      enum: ["none", "weak", "moderate", "strong"],
      id: "clearanceRating",
      kind: "string",
      label: "Clearance rating",
    },
  ],
  calculate: (input) => {
    const zoneMm = input.zoneMm as number;
    const moderateMinimumMm = input.moderateMinimumMm as number;
    const strongMinimumMm = input.strongMinimumMm as number;
    if (!(moderateMinimumMm > 0))
      simpleError(
        "moderateMinimumMm",
        "The moderate threshold must be greater than zero.",
      );
    if (!(strongMinimumMm > moderateMinimumMm))
      simpleError(
        "strongMinimumMm",
        "The strong threshold must exceed the moderate threshold.",
      );
    return {
      clearanceRating:
        zoneMm === 0
          ? "none"
          : zoneMm < moderateMinimumMm
            ? "weak"
            : zoneMm < strongMinimumMm
              ? "moderate"
              : "strong",
    };
  },
});
export const runCelluloseClearanceZoneRater =
  celluloseClearanceZoneRaterTool.execute;
export default celluloseClearanceZoneRaterTool;
