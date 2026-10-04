import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumeText: string;
  readonly season: string;
  readonly year: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeText: { type: "string", maxLength: 8192 },
    season: { type: "string", maxLength: 8192 },
    year: { type: "integer", minimum: 1, maximum: 9999 },
  },
  required: ["volumeText", "season", "year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format literal periodical volume and season wording with an explicit year. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumeText, season, year } = request;
  const compute = (): Output => {
    H.domain(volumeText.length > 0 && season.length > 0, "volumeText");
    (H.domain(Number.isSafeInteger(year) && year >= 1 && year <= 9999, "year"),
      year);
    return { label: "vol. " + volumeText + ", " + season + " " + year };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumeText: "12", season: "Spring", year: 2026 },
  output: { label: "vol. 12, Spring 2026" },
} satisfies ToolExample<Input, Output>;
export const americanPeriodicalVolumeSeasonLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "american-studies/american-periodical-volume-season-label",
      title: "American Periodical Volume Season Label Tool",
      description:
        "Format literal periodical volume and season wording with an explicit year.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          volumeText: { type: "string", maxLength: 8192 },
          season: { type: "string", maxLength: 8192 },
          year: { type: "integer", minimum: 1, maximum: 9999 },
        },
        required: ["volumeText", "season", "year"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "volumeText",
            label: "Volume Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "season",
            label: "Season",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "year",
            label: "Year",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = americanPeriodicalVolumeSeasonLabelTool.execute;
export default americanPeriodicalVolumeSeasonLabelTool;
