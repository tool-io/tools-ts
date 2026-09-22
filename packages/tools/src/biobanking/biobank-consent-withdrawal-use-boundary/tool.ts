import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly useDay: number;
  readonly withdrawalDay: number;
  readonly withdrawn: boolean;
  readonly equalityBlocked: boolean;
  readonly previouslyApproved: boolean;
};
export type Output = {
  readonly afterBoundary: boolean;
  readonly permittedUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    useDay: { type: "integer" },
    withdrawalDay: { type: "integer" },
    withdrawn: { type: "boolean" },
    equalityBlocked: { type: "boolean" },
    previouslyApproved: { type: "boolean" },
  },
  required: [
    "useDay",
    "withdrawalDay",
    "withdrawn",
    "equalityBlocked",
    "previouslyApproved",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    afterBoundary: { type: "boolean" },
    permittedUnderFlags: { type: "boolean" },
  },
  required: ["afterBoundary", "permittedUnderFlags"],
} as const;
/** Apply an explicit withdrawal-time boundary to supplied record-use flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    useDay,
    withdrawalDay,
    withdrawn,
    equalityBlocked,
    previouslyApproved,
  } = request;
  const compute = (): Output => {
    const afterBoundary =
      withdrawn &&
      (equalityBlocked ? useDay >= withdrawalDay : useDay > withdrawalDay);
    return {
      afterBoundary,
      permittedUnderFlags: previouslyApproved && !afterBoundary,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    useDay: 100,
    withdrawalDay: 100,
    withdrawn: true,
    equalityBlocked: true,
    previouslyApproved: true,
  },
  output: { afterBoundary: true, permittedUnderFlags: false },
} satisfies ToolExample<Input, Output>;
export const biobankConsentWithdrawalUseBoundaryTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biobanking/biobank-consent-withdrawal-use-boundary",
      title: "Biobank Consent Withdrawal Use Boundary Tool",
      description:
        "Apply an explicit withdrawal-time boundary to supplied record-use flags.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          useDay: { type: "integer" },
          withdrawalDay: { type: "integer" },
          withdrawn: { type: "boolean" },
          equalityBlocked: { type: "boolean" },
          previouslyApproved: { type: "boolean" },
        },
        required: [
          "useDay",
          "withdrawalDay",
          "withdrawn",
          "equalityBlocked",
          "previouslyApproved",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          afterBoundary: { type: "boolean" },
          permittedUnderFlags: { type: "boolean" },
        },
        required: ["afterBoundary", "permittedUnderFlags"],
      },
      ports: {
        inputs: [
          {
            id: "useDay",
            label: "Use Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "withdrawalDay",
            label: "Withdrawal Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "withdrawn",
            label: "Withdrawn",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "equalityBlocked",
            label: "Equality Blocked",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "previouslyApproved",
            label: "Previously Approved",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "afterBoundary",
            label: "After Boundary",
            valueType: { type: "boolean" },
          },
          {
            id: "permittedUnderFlags",
            label: "Permitted Under Flags",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biobankConsentWithdrawalUseBoundaryTool.execute;
export default biobankConsentWithdrawalUseBoundaryTool;
