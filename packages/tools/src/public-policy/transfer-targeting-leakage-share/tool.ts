import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalRecipients: number;
  readonly ineligibleRecipients: number;
  readonly totalTransfer: number;
  readonly ineligibleTransfer: number;
};
export type Output = {
  readonly recipientLeakage: number;
  readonly amountLeakage: number;
  readonly eligibleTransfer: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRecipients: { type: "integer", minimum: 1 },
    ineligibleRecipients: { type: "integer", minimum: 0 },
    totalTransfer: { type: "number", exclusiveMinimum: 0 },
    ineligibleTransfer: { type: "number", minimum: 0 },
  },
  required: [
    "totalRecipients",
    "ineligibleRecipients",
    "totalTransfer",
    "ineligibleTransfer",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recipientLeakage: { type: "number" },
    amountLeakage: { type: "number" },
    eligibleTransfer: { type: "number" },
  },
  required: ["recipientLeakage", "amountLeakage", "eligibleTransfer"],
} as const;
/** Calculate transfer targeting leakage share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    totalRecipients,
    ineligibleRecipients,
    totalTransfer,
    ineligibleTransfer,
  } = request;
  const compute = (): Output => {
    H.integer(totalRecipients, 1);
    H.integer(ineligibleRecipients, 0, totalRecipients);
    H.positive(totalTransfer);
    H.domain(ineligibleTransfer >= 0 && ineligibleTransfer <= totalTransfer);
    return {
      recipientLeakage: ineligibleRecipients / totalRecipients,
      amountLeakage: ineligibleTransfer / totalTransfer,
      eligibleTransfer: totalTransfer - ineligibleTransfer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalRecipients: 100,
    ineligibleRecipients: 10,
    totalTransfer: 1000,
    ineligibleTransfer: 200,
  },
  output: { recipientLeakage: 0.1, amountLeakage: 0.2, eligibleTransfer: 800 },
} satisfies ToolExample<Input, Output>;
export const transferTargetingLeakageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/transfer-targeting-leakage-share",
    title: "Transfer Targeting Leakage Share Tool",
    description:
      "Calculate transfer targeting leakage share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRecipients: { type: "integer", minimum: 1 },
        ineligibleRecipients: { type: "integer", minimum: 0 },
        totalTransfer: { type: "number", exclusiveMinimum: 0 },
        ineligibleTransfer: { type: "number", minimum: 0 },
      },
      required: [
        "totalRecipients",
        "ineligibleRecipients",
        "totalTransfer",
        "ineligibleTransfer",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recipientLeakage: { type: "number" },
        amountLeakage: { type: "number" },
        eligibleTransfer: { type: "number" },
      },
      required: ["recipientLeakage", "amountLeakage", "eligibleTransfer"],
    },
    ports: {
      inputs: [
        {
          id: "totalRecipients",
          label: "Total Recipients",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ineligibleRecipients",
          label: "Ineligible Recipients",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalTransfer",
          label: "Total Transfer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ineligibleTransfer",
          label: "Ineligible Transfer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recipientLeakage",
          label: "Recipient Leakage",
          valueType: { type: "number" },
        },
        {
          id: "amountLeakage",
          label: "Amount Leakage",
          valueType: { type: "number" },
        },
        {
          id: "eligibleTransfer",
          label: "Eligible Transfer",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = transferTargetingLeakageShareTool.execute;
export default transferTargetingLeakageShareTool;
