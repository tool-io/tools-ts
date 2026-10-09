import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedUnits: number;
  readonly redeemedUnits: number;
  readonly depositPerUnit: number;
};
export type Output = {
  readonly unredeemedUnits: number;
  readonly unredeemedValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedUnits: { type: "integer", minimum: 0 },
    redeemedUnits: { type: "integer", minimum: 0 },
    depositPerUnit: { type: "number", minimum: 0 },
  },
  required: ["issuedUnits", "redeemedUnits", "depositPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unredeemedUnits: { type: "integer" },
    unredeemedValue: { type: "number" },
  },
  required: ["unredeemedUnits", "unredeemedValue"],
} as const;
/** Reconcile supplied issued and redeemed deposit counts and value the signed remainder without selecting refund or revenue-recognition policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedUnits, redeemedUnits, depositPerUnit } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(issuedUnits) &&
        issuedUnits >= 0 &&
        issuedUnits <= Number.MAX_SAFE_INTEGER,
      "issuedUnits",
    ),
      issuedUnits);
    (H.domain(
      Number.isSafeInteger(redeemedUnits) &&
        redeemedUnits >= 0 &&
        redeemedUnits <= Number.MAX_SAFE_INTEGER,
      "redeemedUnits",
    ),
      redeemedUnits);
    H.domain(depositPerUnit >= 0, "depositPerUnit");
    return {
      unredeemedUnits: issuedUnits - redeemedUnits,
      unredeemedValue: (issuedUnits - redeemedUnits) * depositPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issuedUnits: 100, redeemedUnits: 80, depositPerUnit: 0.25 },
  output: { unredeemedUnits: 20, unredeemedValue: 5 },
} satisfies ToolExample<Input, Output>;
export const recyclingDepositUnredeemedValueTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/recycling-deposit-unredeemed-value-term",
      title: "Recycling Deposit Unredeemed Value Term Tool",
      description:
        "Reconcile supplied issued and redeemed deposit counts and value the signed remainder without selecting refund or revenue-recognition policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issuedUnits: { type: "integer", minimum: 0 },
          redeemedUnits: { type: "integer", minimum: 0 },
          depositPerUnit: { type: "number", minimum: 0 },
        },
        required: ["issuedUnits", "redeemedUnits", "depositPerUnit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unredeemedUnits: { type: "integer" },
          unredeemedValue: { type: "number" },
        },
        required: ["unredeemedUnits", "unredeemedValue"],
      },
      ports: {
        inputs: [
          {
            id: "issuedUnits",
            label: "Issued Units",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "redeemedUnits",
            label: "Redeemed Units",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "depositPerUnit",
            label: "Deposit Per Unit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unredeemedUnits",
            label: "Unredeemed Units",
            valueType: { type: "integer" },
          },
          {
            id: "unredeemedValue",
            label: "Unredeemed Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = recyclingDepositUnredeemedValueTermTool.execute;
export default recyclingDepositUnredeemedValueTermTool;
