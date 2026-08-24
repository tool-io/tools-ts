import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ItalicSlantDegreeRaterInput = {
  readonly slantDegrees: number;
};

export type ItalicSlantDegreeRaterOutput = {
  readonly degreesFromVertical: number;
  readonly rating:
    "upright" | "slight_slant" | "chancery_italic" | "steep_cursive";
};

const BANDS = [
  { limit: 6, rating: "upright" },
  { limit: 12, rating: "slight_slant" },
  { limit: 20, rating: "chancery_italic" },
] as const;

export const calculateItalicSlantDegreeRater = (
  input: ItalicSlantDegreeRaterInput,
): ItalicSlantDegreeRaterOutput => {
  const degrees = input.slantDegrees;
  if (!(Number.isFinite(degrees) && degrees >= 0 && degrees <= 45))
    return simpleError(
      "slantDegrees",
      "Slant must be a finite angle from 0 through 45 degrees.",
      "invalid_angle",
    );
  const band = BANDS.find(({ limit }) => degrees < limit);
  return {
    degreesFromVertical: degrees,
    rating: band ? band.rating : "steep_cursive",
  };
};

export const italicSlantDegreeRaterExample = {
  input: { slantDegrees: 14 },
  output: {
    degreesFromVertical: 14,
    rating: "chancery_italic",
  },
} satisfies ToolExample<
  ItalicSlantDegreeRaterInput,
  ItalicSlantDegreeRaterOutput
>;

export const italicSlantDegreeRaterTool = createSimpleTool({
  id: "paleography/italic-slant-degree-rater",
  title: "Italic Slant Degree Rater",
  description:
    "Rate the pen slant of an italic hand under the stated bands measured clockwise from vertical: under 6 degrees upright, under 12 slight_slant, under 20 chancery_italic, and 20 to 45 steep_cursive.",
  inputs: [
    {
      description: "Pen slant in degrees clockwise from vertical.",
      id: "slantDegrees",
      kind: "number",
      label: "Slant",
      maximum: 45,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Echo of the supplied slant angle.",
      id: "degreesFromVertical",
      kind: "number",
      label: "Degrees",
    },
    {
      description: "Stated-band rating for the measured slant.",
      id: "rating",
      enum: ["upright", "slight_slant", "chancery_italic", "steep_cursive"],
      kind: "string",
      label: "Rating",
    },
  ],
  calculate: (input) =>
    calculateItalicSlantDegreeRater({
      slantDegrees: input.slantDegrees as number,
    }),
});

export const runItalicSlantDegreeRater = italicSlantDegreeRaterTool.execute;
export default italicSlantDegreeRaterTool;
