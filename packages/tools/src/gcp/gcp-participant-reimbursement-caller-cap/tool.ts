import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly travel: number;
  readonly parking: number;
  readonly otherEligible: number;
  readonly previousPaid: number;
  readonly totalCap: number;
};
export type Output = {
  readonly claimEligible: number;
  readonly remainingCap: number;
  readonly payable: number;
  readonly uncovered: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    travel: { type: "number", minimum: 0 },
    parking: { type: "number", minimum: 0 },
    otherEligible: { type: "number", minimum: 0 },
    previousPaid: { type: "number", minimum: 0 },
    totalCap: { type: "number", minimum: 0 },
  },
  required: ["travel", "parking", "otherEligible", "previousPaid", "totalCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimEligible: { type: "number" },
    remainingCap: { type: "number" },
    payable: { type: "number" },
    uncovered: { type: "number" },
  },
  required: ["claimEligible", "remainingCap", "payable", "uncovered"],
} as const;
/** Calculate gcp participant reimbursement caller cap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { travel, parking, otherEligible, previousPaid, totalCap } = request;
  const compute = (): Output => {
    H.domain(
      travel >= 0 &&
        parking >= 0 &&
        otherEligible >= 0 &&
        previousPaid >= 0 &&
        totalCap >= 0,
    );
    return {
      claimEligible: travel + parking + otherEligible,
      remainingCap: Math.max(0, totalCap - previousPaid),
      payable: Math.min(
        travel + parking + otherEligible,
        Math.max(0, totalCap - previousPaid),
      ),
      uncovered: Math.max(
        0,
        travel + parking + otherEligible - Math.max(0, totalCap - previousPaid),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    travel: 20,
    parking: 5,
    otherEligible: 10,
    previousPaid: 80,
    totalCap: 100,
  },
  output: { claimEligible: 35, remainingCap: 20, payable: 20, uncovered: 15 },
} satisfies ToolExample<Input, Output>;
export const gcpParticipantReimbursementCallerCapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gcp/gcp-participant-reimbursement-caller-cap",
      title: "GCP Participant Reimbursement Caller Cap Tool",
      description:
        "Calculate gcp participant reimbursement caller cap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          travel: { type: "number", minimum: 0 },
          parking: { type: "number", minimum: 0 },
          otherEligible: { type: "number", minimum: 0 },
          previousPaid: { type: "number", minimum: 0 },
          totalCap: { type: "number", minimum: 0 },
        },
        required: [
          "travel",
          "parking",
          "otherEligible",
          "previousPaid",
          "totalCap",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          claimEligible: { type: "number" },
          remainingCap: { type: "number" },
          payable: { type: "number" },
          uncovered: { type: "number" },
        },
        required: ["claimEligible", "remainingCap", "payable", "uncovered"],
      },
      ports: {
        inputs: [
          {
            id: "travel",
            label: "Travel",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "parking",
            label: "Parking",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherEligible",
            label: "Other Eligible",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "previousPaid",
            label: "Previous Paid",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalCap",
            label: "Total Cap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "claimEligible",
            label: "Claim Eligible",
            valueType: { type: "number" },
          },
          {
            id: "remainingCap",
            label: "Remaining Cap",
            valueType: { type: "number" },
          },
          { id: "payable", label: "Payable", valueType: { type: "number" } },
          {
            id: "uncovered",
            label: "Uncovered",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gcpParticipantReimbursementCallerCapTool.execute;
export default gcpParticipantReimbursementCallerCapTool;
