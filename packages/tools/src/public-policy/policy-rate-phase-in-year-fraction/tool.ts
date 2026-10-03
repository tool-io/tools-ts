import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yearStart: number;
  readonly nextYearStart: number;
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
    yearStart: { type: "integer" },
    nextYearStart: { type: "integer" },
    effectiveDay: { type: "integer" },
    oldRate: { type: "number" },
    newRate: { type: "number" },
  },
  required: [
    "yearStart",
    "nextYearStart",
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
/** General rate proration over supplied half-open day-index bounds, without selecting statutory rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yearStart, nextYearStart, effectiveDay, oldRate, newRate } = request;
  const compute = (): Output => {
    H.domain(
      nextYearStart > yearStart &&
        effectiveDay >= yearStart &&
        effectiveDay <= nextYearStart,
    );
    return {
      newRateFraction:
        (nextYearStart - effectiveDay) / (nextYearStart - yearStart),
      blendedRate:
        (oldRate * (effectiveDay - yearStart) +
          newRate * (nextYearStart - effectiveDay)) /
        (nextYearStart - yearStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    yearStart: 0,
    nextYearStart: 360,
    effectiveDay: 90,
    oldRate: 0.1,
    newRate: 0.2,
  },
  output: { newRateFraction: 0.75, blendedRate: 0.175 },
} satisfies ToolExample<Input, Output>;
export const policyRatePhaseInYearFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-rate-phase-in-year-fraction",
    title: "Policy Rate Phase In Year Fraction Tool",
    description:
      "General rate proration over supplied half-open day-index bounds, without selecting statutory rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yearStart: { type: "integer" },
        nextYearStart: { type: "integer" },
        effectiveDay: { type: "integer" },
        oldRate: { type: "number" },
        newRate: { type: "number" },
      },
      required: [
        "yearStart",
        "nextYearStart",
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
          id: "yearStart",
          label: "Year Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextYearStart",
          label: "Next Year Start",
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
          valueType: { type: "number", unit: "1" },
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
export const run = policyRatePhaseInYearFractionTool.execute;
export default policyRatePhaseInYearFractionTool;
