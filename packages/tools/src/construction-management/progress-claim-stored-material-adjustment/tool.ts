import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workValue: number;
  readonly eligibleStoredMaterialValue: number;
  readonly previouslyClaimedValue: number;
};
export type Output = { readonly currentClaimValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workValue: { type: "number", minimum: 0 },
    eligibleStoredMaterialValue: { type: "number", minimum: 0 },
    previouslyClaimedValue: { type: "number", minimum: 0 },
  },
  required: [
    "workValue",
    "eligibleStoredMaterialValue",
    "previouslyClaimedValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { currentClaimValue: { type: "number" } },
  required: ["currentClaimValue"],
} as const;
/** Combine explicit work and supplied eligible stored-material values less previously claimed value without certifying a payment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workValue, eligibleStoredMaterialValue, previouslyClaimedValue } =
    request;
  const compute = (): Output => {
    H.domain(workValue >= 0, "workValue");
    H.domain(eligibleStoredMaterialValue >= 0, "eligibleStoredMaterialValue");
    H.domain(previouslyClaimedValue >= 0, "previouslyClaimedValue");
    return {
      currentClaimValue:
        workValue + eligibleStoredMaterialValue - previouslyClaimedValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workValue: 1000,
    eligibleStoredMaterialValue: 200,
    previouslyClaimedValue: 700,
  },
  output: { currentClaimValue: 500 },
} satisfies ToolExample<Input, Output>;
export const progressClaimStoredMaterialAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "construction-management",
          "construction management",
          "engineering",
        ],
        keywords: ["construction management", "engineering"],
      },
      id: "construction-management/progress-claim-stored-material-adjustment",
      title: "Progress Claim Stored Material Adjustment",
      description:
        "Combine explicit work and supplied eligible stored-material values less previously claimed value without certifying a payment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workValue: { type: "number", minimum: 0 },
          eligibleStoredMaterialValue: { type: "number", minimum: 0 },
          previouslyClaimedValue: { type: "number", minimum: 0 },
        },
        required: [
          "workValue",
          "eligibleStoredMaterialValue",
          "previouslyClaimedValue",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { currentClaimValue: { type: "number" } },
        required: ["currentClaimValue"],
      },
      ports: {
        inputs: [
          {
            id: "workValue",
            label: "Work Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eligibleStoredMaterialValue",
            label: "Eligible Stored Material Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "previouslyClaimedValue",
            label: "Previously Claimed Value",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "currentClaimValue",
            label: "Current Claim Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = progressClaimStoredMaterialAdjustmentTool.execute;
export default progressClaimStoredMaterialAdjustmentTool;
