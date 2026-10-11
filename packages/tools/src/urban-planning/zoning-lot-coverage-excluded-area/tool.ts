import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossFootprintArea: number;
  readonly explicitlyExcludedArea: number;
  readonly lotArea: number;
};
export type Output = {
  readonly countedFootprintArea: number;
  readonly coverageFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossFootprintArea: { type: "number", minimum: 0 },
    explicitlyExcludedArea: { type: "number", minimum: 0 },
    lotArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["grossFootprintArea", "explicitlyExcludedArea", "lotArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedFootprintArea: { type: "number" },
    coverageFraction: { type: "number" },
  },
  required: ["countedFootprintArea", "coverageFraction"],
} as const;
/** Normalize explicit footprint after supplied exclusions to lot area without deciding zoning coverage rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossFootprintArea, explicitlyExcludedArea, lotArea } = request;
  const compute = (): Output => {
    H.domain(
      grossFootprintArea >= 0 &&
        explicitlyExcludedArea >= 0 &&
        explicitlyExcludedArea <= grossFootprintArea,
      "grossFootprintArea",
    );
    (H.domain(Number.isFinite(lotArea) && lotArea > 0, "lotArea"), lotArea);
    return {
      countedFootprintArea: grossFootprintArea - explicitlyExcludedArea,
      coverageFraction: (grossFootprintArea - explicitlyExcludedArea) / lotArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossFootprintArea: 200, explicitlyExcludedArea: 20, lotArea: 600 },
  output: { countedFootprintArea: 180, coverageFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const zoningLotCoverageExcludedAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-planning", "urban planning", "arts and design"],
      keywords: ["urban planning", "arts and design"],
    },
    id: "urban-planning/zoning-lot-coverage-excluded-area",
    title: "Zoning Lot Coverage Excluded Area",
    description:
      "Normalize explicit footprint after supplied exclusions to lot area without deciding zoning coverage rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossFootprintArea: { type: "number", minimum: 0 },
        explicitlyExcludedArea: { type: "number", minimum: 0 },
        lotArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["grossFootprintArea", "explicitlyExcludedArea", "lotArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedFootprintArea: { type: "number" },
        coverageFraction: { type: "number" },
      },
      required: ["countedFootprintArea", "coverageFraction"],
    },
    ports: {
      inputs: [
        {
          id: "grossFootprintArea",
          label: "Gross Footprint Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "explicitlyExcludedArea",
          label: "Explicitly Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lotArea",
          label: "Lot Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedFootprintArea",
          label: "Counted Footprint Area",
          valueType: { type: "number" },
        },
        {
          id: "coverageFraction",
          label: "Coverage Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = zoningLotCoverageExcludedAreaTool.execute;
export default zoningLotCoverageExcludedAreaTool;
