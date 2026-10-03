import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seasonDays: number;
  readonly coveredDays: number;
  readonly partialDays: number;
  readonly partialWeight: number;
};
export type Output = {
  readonly effectiveDays: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seasonDays: { type: "integer", minimum: 1 },
    coveredDays: { type: "integer", minimum: 0 },
    partialDays: { type: "integer", minimum: 0 },
    partialWeight: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["seasonDays", "coveredDays", "partialDays", "partialWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDays: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["effectiveDays", "fraction"],
} as const;
/** Calculate cover crop living cover day fraction term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seasonDays, coveredDays, partialDays, partialWeight } = request;
  const compute = (): Output => {
    H.integer(seasonDays, 1);
    H.integer(coveredDays, 0);
    H.integer(partialDays, 0);
    H.domain(coveredDays + partialDays <= seasonDays);
    H.probability(partialWeight);
    return {
      effectiveDays: coveredDays + partialDays * partialWeight,
      fraction: (coveredDays + partialDays * partialWeight) / seasonDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seasonDays: 100,
    coveredDays: 60,
    partialDays: 20,
    partialWeight: 0.5,
  },
  output: { effectiveDays: 70, fraction: 0.7 },
} satisfies ToolExample<Input, Output>;
export const coverCropLivingCoverDayFractionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sustainable-agriculture/cover-crop-living-cover-day-fraction-term",
      title: "Cover Crop Living Cover Day Fraction Term Tool",
      description:
        "Calculate cover crop living cover day fraction term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seasonDays: { type: "integer", minimum: 1 },
          coveredDays: { type: "integer", minimum: 0 },
          partialDays: { type: "integer", minimum: 0 },
          partialWeight: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["seasonDays", "coveredDays", "partialDays", "partialWeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectiveDays: { type: "number" },
          fraction: { type: "number" },
        },
        required: ["effectiveDays", "fraction"],
      },
      ports: {
        inputs: [
          {
            id: "seasonDays",
            label: "Season Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "coveredDays",
            label: "Covered Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "partialDays",
            label: "Partial Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "partialWeight",
            label: "Partial Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "effectiveDays",
            label: "Effective Days",
            valueType: { type: "number" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = coverCropLivingCoverDayFractionTermTool.execute;
export default coverCropLivingCoverDayFractionTermTool;
