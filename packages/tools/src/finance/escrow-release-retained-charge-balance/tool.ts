import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly escrow: number;
  readonly release: number;
  readonly retainedCharge: number;
};
export type Output = {
  readonly remaining: number;
  readonly beneficiary: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    escrow: { type: "number", minimum: 0 },
    release: { type: "number", minimum: 0 },
    retainedCharge: { type: "number", minimum: 0 },
  },
  required: ["escrow", "release", "retainedCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    beneficiary: { type: "number" },
  },
  required: ["remaining", "beneficiary"],
} as const;
/** Split a permitted escrow release into beneficiary proceeds and a caller-supplied retained charge. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { escrow, release, retainedCharge } = input;
  const compute = (): Output => {
    H.domain(
      escrow >= 0 &&
        release >= 0 &&
        retainedCharge >= 0 &&
        release <= escrow &&
        retainedCharge <= release,
    );
    return {
      remaining: escrow - release,
      beneficiary: release - retainedCharge,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { escrow: 1000, release: 700, retainedCharge: 25 },
  output: { remaining: 300, beneficiary: 675 },
} satisfies ToolExample<Input, Output>;
export const escrowReleaseRetainedChargeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/escrow-release-retained-charge-balance",
    title: "Escrow Release Retained Charge Balance Tool",
    description:
      "Split a permitted escrow release into beneficiary proceeds and a caller-supplied retained charge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        escrow: { type: "number", minimum: 0 },
        release: { type: "number", minimum: 0 },
        retainedCharge: { type: "number", minimum: 0 },
      },
      required: ["escrow", "release", "retainedCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        beneficiary: { type: "number" },
      },
      required: ["remaining", "beneficiary"],
    },
    ports: {
      inputs: [
        {
          id: "escrow",
          label: "Escrow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "release",
          label: "Release",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainedCharge",
          label: "Retained Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "beneficiary",
          label: "Beneficiary",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = escrowReleaseRetainedChargeBalanceTool.execute;
export default escrowReleaseRetainedChargeBalanceTool;
