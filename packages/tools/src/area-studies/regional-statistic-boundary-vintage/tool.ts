import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionCode: string;
  readonly statisticYear: number;
  readonly boundaryYear: number;
};
export type Output = {
  readonly label: string;
  readonly vintageGapYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionCode: { type: "string", maxLength: 8192, minLength: 1 },
    statisticYear: { type: "integer", minimum: 1, maximum: 9999 },
    boundaryYear: { type: "integer", minimum: 1, maximum: 9999 },
  },
  required: ["regionCode", "statisticYear", "boundaryYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    vintageGapYears: { type: "integer" },
  },
  required: ["label", "vintageGapYears"],
} as const;
/** Label a statistic’s explicitly supplied geographic boundary vintage and signed year gap without harmonizing boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionCode, statisticYear, boundaryYear } = request;
  const compute = (): Output => {
    H.domain(regionCode.length > 0, "regionCode");
    (H.domain(
      Number.isSafeInteger(statisticYear) &&
        statisticYear >= 1 &&
        statisticYear <= 9999,
      "statisticYear",
    ),
      statisticYear);
    (H.domain(
      Number.isSafeInteger(boundaryYear) &&
        boundaryYear >= 1 &&
        boundaryYear <= 9999,
      "boundaryYear",
    ),
      boundaryYear);
    return {
      label:
        regionCode +
        "; statistic " +
        statisticYear +
        "; boundary vintage " +
        boundaryYear,
      vintageGapYears: statisticYear - boundaryYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regionCode: "R17", statisticYear: 2026, boundaryYear: 2020 },
  output: {
    label: "R17; statistic 2026; boundary vintage 2020",
    vintageGapYears: 6,
  },
} satisfies ToolExample<Input, Output>;
export const regionalStatisticBoundaryVintageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/regional-statistic-boundary-vintage",
    title: "Regional Statistic Boundary Vintage",
    description:
      "Label a statistic’s explicitly supplied geographic boundary vintage and signed year gap without harmonizing boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionCode: { type: "string", maxLength: 8192, minLength: 1 },
        statisticYear: { type: "integer", minimum: 1, maximum: 9999 },
        boundaryYear: { type: "integer", minimum: 1, maximum: 9999 },
      },
      required: ["regionCode", "statisticYear", "boundaryYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        vintageGapYears: { type: "integer" },
      },
      required: ["label", "vintageGapYears"],
    },
    ports: {
      inputs: [
        {
          id: "regionCode",
          label: "Region Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "statisticYear",
          label: "Statistic Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "boundaryYear",
          label: "Boundary Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "vintageGapYears",
          label: "Vintage Gap Years",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = regionalStatisticBoundaryVintageTool.execute;
export default regionalStatisticBoundaryVintageTool;
