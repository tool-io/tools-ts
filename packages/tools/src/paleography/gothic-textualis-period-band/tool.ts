import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GothicTextualisPeriodBandInput = {
  readonly year: number;
};

export type GothicTextualisPeriodBandOutput = {
  readonly periodBand:
    | "pre_gothic"
    | "protogothic_transitional"
    | "early_textualis"
    | "mature_textualis"
    | "late_textualis"
    | "post_gothic";
  readonly bandBounds: string;
};

export const calculateGothicTextualisPeriodBand = (
  input: GothicTextualisPeriodBandInput,
): GothicTextualisPeriodBandOutput => {
  if (!(
    Number.isSafeInteger(input.year) &&
    input.year >= 700 &&
    input.year <= 1600
  ))
    return simpleError(
      "year",
      "Year must be an integer from 700 through 1600.",
      "invalid_year",
    );
  const year = input.year;
  const periodBand =
    year < 1100
      ? "pre_gothic"
      : year < 1200
        ? "protogothic_transitional"
        : year < 1300
          ? "early_textualis"
          : year < 1400
            ? "mature_textualis"
            : year < 1500
              ? "late_textualis"
              : "post_gothic";
  const BOUNDS: Record<GothicTextualisPeriodBandOutput["periodBand"], string> =
    {
      pre_gothic: "before 1100",
      protogothic_transitional: "1100-1199",
      early_textualis: "1200-1299",
      mature_textualis: "1300-1399",
      late_textualis: "1400-1499",
      post_gothic: "from 1500",
    };
  return { periodBand, bandBounds: BOUNDS[periodBand] };
};

export const gothicTextualisPeriodBandExample = {
  input: { year: 1275 },
  output: { periodBand: "early_textualis", bandBounds: "1200-1299" },
} satisfies ToolExample<
  GothicTextualisPeriodBandInput,
  GothicTextualisPeriodBandOutput
>;

export const gothicTextualisPeriodBandTool = createSimpleTool({
  id: "paleography/gothic-textualis-period-band",
  title: "Gothic Textualis Period Band",
  description:
    "Map a calendar year onto the conventional Gothic textualis bands stated here plainly: pre-Gothic (before 1100), protogothic transitional (1100-1199), early textualis (1200-1299), mature textualis (1300-1399), late textualis (1400-1499) and post-Gothic (from 1500).",
  inputs: [
    {
      description: "Calendar year of the manuscript.",
      id: "year",
      kind: "integer",
      label: "Year",
      maximum: 1600,
      minimum: 700,
    },
  ],
  outputs: [
    {
      description: "Conventional Gothic textualis band for the year.",
      id: "periodBand",
      enum: [
        "pre_gothic",
        "protogothic_transitional",
        "early_textualis",
        "mature_textualis",
        "late_textualis",
        "post_gothic",
      ],
      kind: "string",
      label: "Period band",
    },
    {
      description: "Year bounds of the band as stated in the description.",
      id: "bandBounds",
      kind: "string",
      label: "Band bounds",
    },
  ],
  calculate: (input) =>
    calculateGothicTextualisPeriodBand({ year: input.year as number }),
});

export const runGothicTextualisPeriodBand =
  gothicTextualisPeriodBandTool.execute;
export default gothicTextualisPeriodBandTool;
