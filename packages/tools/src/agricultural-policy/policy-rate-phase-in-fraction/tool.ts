import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as prorate } from "../../public-policy/policy-rate-phase-in-year-fraction/tool.js";
export type Input = {
  readonly claimSeasonStart: number;
  readonly nextClaimSeasonStart: number;
  readonly effectiveDay: number;
  readonly oldRate: number;
  readonly newRate: number;
};
export type Output = {
  readonly newRateFraction: number;
  readonly blendedRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimSeasonStart: { type: "integer" },
    nextClaimSeasonStart: { type: "integer" },
    effectiveDay: { type: "integer" },
    oldRate: { type: "number" },
    newRate: { type: "number" },
  },
  required: [
    "claimSeasonStart",
    "nextClaimSeasonStart",
    "effectiveDay",
    "oldRate",
    "newRate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newRateFraction: { type: "number" },
    blendedRate: { type: "number" },
  },
  required: ["newRateFraction", "blendedRate"],
} as const;
/** Prorate supplied agricultural support rates over explicit half-open claim-season day anchors, reusing the general rate proration calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    claimSeasonStart,
    nextClaimSeasonStart,
    effectiveDay,
    oldRate,
    newRate,
  } = request;
  const compute = (): Output => {
    return prorate({
      yearStart: claimSeasonStart,
      nextYearStart: nextClaimSeasonStart,
      effectiveDay,
      oldRate,
      newRate,
    });
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimSeasonStart: 0,
    nextClaimSeasonStart: 360,
    effectiveDay: 90,
    oldRate: 0.1,
    newRate: 0.2,
  },
  output: { newRateFraction: 0.75, blendedRate: 0.175 },
} satisfies ToolExample<Input, Output>;
export const policyRatePhaseInFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/policy-rate-phase-in-fraction",
    title: "Policy Rate Phase In Fraction Tool",
    description:
      "Prorate supplied agricultural support rates over explicit half-open claim-season day anchors, reusing the general rate proration calculation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimSeasonStart: { type: "integer" },
        nextClaimSeasonStart: { type: "integer" },
        effectiveDay: { type: "integer" },
        oldRate: { type: "number" },
        newRate: { type: "number" },
      },
      required: [
        "claimSeasonStart",
        "nextClaimSeasonStart",
        "effectiveDay",
        "oldRate",
        "newRate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newRateFraction: { type: "number" },
        blendedRate: { type: "number" },
      },
      required: ["newRateFraction", "blendedRate"],
    },
    ports: {
      inputs: [
        {
          id: "claimSeasonStart",
          label: "Claim Season Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextClaimSeasonStart",
          label: "Next Claim Season Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effectiveDay",
          label: "Effective Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oldRate",
          label: "Old Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newRate",
          label: "New Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newRateFraction",
          label: "New Rate Fraction",
          valueType: { type: "number" },
        },
        {
          id: "blendedRate",
          label: "Blended Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyRatePhaseInFractionTool.execute;
export default policyRatePhaseInFractionTool;
