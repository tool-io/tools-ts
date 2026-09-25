import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineLooking: number;
  readonly habituatedLooking: number;
  readonly recoveryLooking: number;
};
export type Output = {
  readonly habituationDrop: number;
  readonly recoveredLooking: number;
  readonly recoveryFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineLooking: { type: "number" },
    habituatedLooking: { type: "number", minimum: 0 },
    recoveryLooking: { type: "number", minimum: 0 },
  },
  required: ["baselineLooking", "habituatedLooking", "recoveryLooking"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    habituationDrop: { type: "number" },
    recoveredLooking: { type: "number" },
    recoveryFraction: { type: "number" },
  },
  required: ["habituationDrop", "recoveredLooking", "recoveryFraction"],
} as const;
/** Looking-time recovery relative to an explicit observed habituation drop; values over one indicate overshoot. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineLooking, habituatedLooking, recoveryLooking } = request;
  const compute = (): Output => {
    H.domain(
      baselineLooking > habituatedLooking &&
        habituatedLooking >= 0 &&
        recoveryLooking >= 0,
    );
    return {
      habituationDrop: baselineLooking - habituatedLooking,
      recoveredLooking: recoveryLooking - habituatedLooking,
      recoveryFraction:
        (recoveryLooking - habituatedLooking) /
        (baselineLooking - habituatedLooking),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselineLooking: 20, habituatedLooking: 8, recoveryLooking: 14 },
  output: { habituationDrop: 12, recoveredLooking: 6, recoveryFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const infantLookingRecoveryBaselineTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/infant-looking-recovery-baseline-term",
    title: "Infant Looking Recovery Baseline Term Tool",
    description:
      "Looking-time recovery relative to an explicit observed habituation drop; values over one indicate overshoot.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineLooking: { type: "number" },
        habituatedLooking: { type: "number", minimum: 0 },
        recoveryLooking: { type: "number", minimum: 0 },
      },
      required: ["baselineLooking", "habituatedLooking", "recoveryLooking"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        habituationDrop: { type: "number" },
        recoveredLooking: { type: "number" },
        recoveryFraction: { type: "number" },
      },
      required: ["habituationDrop", "recoveredLooking", "recoveryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "baselineLooking",
          label: "Baseline Looking",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "habituatedLooking",
          label: "Habituated Looking",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveryLooking",
          label: "Recovery Looking",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "habituationDrop",
          label: "Habituation Drop",
          valueType: { type: "number" },
        },
        {
          id: "recoveredLooking",
          label: "Recovered Looking",
          valueType: { type: "number" },
        },
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = infantLookingRecoveryBaselineTermTool.execute;
export default infantLookingRecoveryBaselineTermTool;
