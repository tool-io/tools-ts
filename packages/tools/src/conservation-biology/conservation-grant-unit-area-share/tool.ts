import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleArea: number;
  readonly totalFundedArea: number;
  readonly totalGrant: number;
};
export type Output = {
  readonly areaShare: number;
  readonly allocatedGrant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number", minimum: 0 },
    totalFundedArea: { type: "number", exclusiveMinimum: 0 },
    totalGrant: { type: "number", minimum: 0 },
  },
  required: ["eligibleArea", "totalFundedArea", "totalGrant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaShare: { type: "number" },
    allocatedGrant: { type: "number" },
  },
  required: ["areaShare", "allocatedGrant"],
} as const;
/** Allocate a supplied conservation grant proportionally to an explicitly eligible area without determining eligibility or award terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleArea, totalFundedArea, totalGrant } = request;
  const compute = (): Output => {
    (H.domain(totalFundedArea > 0, "totalFundedArea"), totalFundedArea);
    H.domain(
      eligibleArea >= 0 && eligibleArea <= totalFundedArea && totalGrant >= 0,
      "eligibleArea",
    );
    return {
      areaShare: eligibleArea / totalFundedArea,
      allocatedGrant: (totalGrant * eligibleArea) / totalFundedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligibleArea: 20, totalFundedArea: 100, totalGrant: 5000 },
  output: { areaShare: 0.2, allocatedGrant: 1000 },
} satisfies ToolExample<Input, Output>;
export const conservationGrantUnitAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/conservation-grant-unit-area-share",
    title: "Conservation Grant Unit Area Share",
    description:
      "Allocate a supplied conservation grant proportionally to an explicitly eligible area without determining eligibility or award terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number", minimum: 0 },
        totalFundedArea: { type: "number", exclusiveMinimum: 0 },
        totalGrant: { type: "number", minimum: 0 },
      },
      required: ["eligibleArea", "totalFundedArea", "totalGrant"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaShare: { type: "number" },
        allocatedGrant: { type: "number" },
      },
      required: ["areaShare", "allocatedGrant"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFundedArea",
          label: "Total Funded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalGrant",
          label: "Total Grant",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "areaShare", label: "Area Share", valueType: { type: "number" } },
        {
          id: "allocatedGrant",
          label: "Allocated Grant",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = conservationGrantUnitAreaShareTool.execute;
export default conservationGrantUnitAreaShareTool;
