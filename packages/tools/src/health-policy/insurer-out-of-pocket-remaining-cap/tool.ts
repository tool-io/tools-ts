import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cap: number;
  readonly previousEligible: number;
  readonly claimEligible: number;
  readonly excludedSpending: number;
};
export type Output = {
  readonly remainingBefore: number;
  readonly coveredByCap: number;
  readonly patientTotal: number;
  readonly remainingAfter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cap: { type: "number", minimum: 0 },
    previousEligible: { type: "number", minimum: 0 },
    claimEligible: { type: "number", minimum: 0 },
    excludedSpending: { type: "number", minimum: 0 },
  },
  required: ["cap", "previousEligible", "claimEligible", "excludedSpending"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingBefore: { type: "number" },
    coveredByCap: { type: "number" },
    patientTotal: { type: "number" },
    remainingAfter: { type: "number" },
  },
  required: [
    "remainingBefore",
    "coveredByCap",
    "patientTotal",
    "remainingAfter",
  ],
} as const;
/** Calculate insurer out of pocket remaining cap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cap, previousEligible, claimEligible, excludedSpending } = request;
  const compute = (): Output => {
    H.domain(
      cap >= 0 &&
        previousEligible >= 0 &&
        claimEligible >= 0 &&
        excludedSpending >= 0,
    );
    return {
      remainingBefore: Math.max(0, cap - previousEligible),
      coveredByCap: Math.max(
        0,
        claimEligible - Math.max(0, cap - previousEligible),
      ),
      patientTotal:
        Math.min(claimEligible, Math.max(0, cap - previousEligible)) +
        excludedSpending,
      remainingAfter: Math.max(0, cap - previousEligible - claimEligible),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cap: 1000,
    previousEligible: 900,
    claimEligible: 200,
    excludedSpending: 30,
  },
  output: {
    remainingBefore: 100,
    coveredByCap: 100,
    patientTotal: 130,
    remainingAfter: 0,
  },
} satisfies ToolExample<Input, Output>;
export const insurerOutOfPocketRemainingCapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/insurer-out-of-pocket-remaining-cap",
    title: "Insurer Out Of Pocket Remaining Cap Tool",
    description:
      "Calculate insurer out of pocket remaining cap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cap: { type: "number", minimum: 0 },
        previousEligible: { type: "number", minimum: 0 },
        claimEligible: { type: "number", minimum: 0 },
        excludedSpending: { type: "number", minimum: 0 },
      },
      required: [
        "cap",
        "previousEligible",
        "claimEligible",
        "excludedSpending",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingBefore: { type: "number" },
        coveredByCap: { type: "number" },
        patientTotal: { type: "number" },
        remainingAfter: { type: "number" },
      },
      required: [
        "remainingBefore",
        "coveredByCap",
        "patientTotal",
        "remainingAfter",
      ],
    },
    ports: {
      inputs: [
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousEligible",
          label: "Previous Eligible",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "claimEligible",
          label: "Claim Eligible",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedSpending",
          label: "Excluded Spending",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingBefore",
          label: "Remaining Before",
          valueType: { type: "number" },
        },
        {
          id: "coveredByCap",
          label: "Covered By Cap",
          valueType: { type: "number" },
        },
        {
          id: "patientTotal",
          label: "Patient Total",
          valueType: { type: "number" },
        },
        {
          id: "remainingAfter",
          label: "Remaining After",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insurerOutOfPocketRemainingCapTool.execute;
export default insurerOutOfPocketRemainingCapTool;
