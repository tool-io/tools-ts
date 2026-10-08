import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousPeriod: number;
  readonly currentPeriod: number;
  readonly requiredLag: number;
};
export type Output = {
  readonly lagAligned: boolean;
  readonly actualLag: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousPeriod: { type: "integer" },
    currentPeriod: { type: "integer" },
    requiredLag: { type: "integer", minimum: 0 },
  },
  required: ["previousPeriod", "currentPeriod", "requiredLag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lagAligned: { type: "boolean" },
    actualLag: { type: "integer" },
  },
  required: ["lagAligned", "actualLag"],
} as const;
/** Check an explicit panel period-index lag without assuming missing rows imply balanced observation coverage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousPeriod, currentPeriod, requiredLag } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousPeriod) &&
        previousPeriod >= -Number.MAX_SAFE_INTEGER &&
        previousPeriod <= Number.MAX_SAFE_INTEGER,
      "previousPeriod",
    ),
      previousPeriod);
    (H.domain(
      Number.isSafeInteger(currentPeriod) &&
        currentPeriod >= -Number.MAX_SAFE_INTEGER &&
        currentPeriod <= Number.MAX_SAFE_INTEGER,
      "currentPeriod",
    ),
      currentPeriod);
    (H.domain(
      Number.isSafeInteger(requiredLag) &&
        requiredLag >= 0 &&
        requiredLag <= Number.MAX_SAFE_INTEGER,
      "requiredLag",
    ),
      requiredLag);
    return {
      lagAligned:
        BigInt(currentPeriod) - BigInt(previousPeriod) === BigInt(requiredLag),
      actualLag: Number(BigInt(currentPeriod) - BigInt(previousPeriod)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousPeriod: 4, currentPeriod: 5, requiredLag: 1 },
  output: { lagAligned: true, actualLag: 1 },
} satisfies ToolExample<Input, Output>;
export const panelLagBalancedPeriodFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/panel-lag-balanced-period-flag",
    title: "Panel Lag Balanced Period Flag Tool",
    description:
      "Check an explicit panel period-index lag without assuming missing rows imply balanced observation coverage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousPeriod: { type: "integer" },
        currentPeriod: { type: "integer" },
        requiredLag: { type: "integer", minimum: 0 },
      },
      required: ["previousPeriod", "currentPeriod", "requiredLag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lagAligned: { type: "boolean" },
        actualLag: { type: "integer" },
      },
      required: ["lagAligned", "actualLag"],
    },
    ports: {
      inputs: [
        {
          id: "previousPeriod",
          label: "Previous Period",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "currentPeriod",
          label: "Current Period",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredLag",
          label: "Required Lag",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lagAligned",
          label: "Lag Aligned",
          valueType: { type: "boolean" },
        },
        {
          id: "actualLag",
          label: "Actual Lag",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = panelLagBalancedPeriodFlagTool.execute;
export default panelLagBalancedPeriodFlagTool;
