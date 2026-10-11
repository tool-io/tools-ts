import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossDisbursement: number;
  readonly suppliedRetainedFraction: number;
};
export type Output = {
  readonly retainedAmount: number;
  readonly paidAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossDisbursement: { type: "number", minimum: 0 },
    suppliedRetainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossDisbursement", "suppliedRetainedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedAmount: { type: "number" },
    paidAmount: { type: "number" },
  },
  required: ["retainedAmount", "paidAmount"],
} as const;
/** Partition an explicit grant disbursement using a supplied retention fraction without selecting grant conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossDisbursement, suppliedRetainedFraction } = request;
  const compute = (): Output => {
    H.domain(grossDisbursement >= 0, "grossDisbursement");
    (H.domain(
      suppliedRetainedFraction >= 0 && suppliedRetainedFraction <= 1,
      "suppliedRetainedFraction",
    ),
      suppliedRetainedFraction);
    return {
      retainedAmount: grossDisbursement * suppliedRetainedFraction,
      paidAmount: grossDisbursement * (1 - suppliedRetainedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossDisbursement: 1000, suppliedRetainedFraction: 0.1 },
  output: { retainedAmount: 100, paidAmount: 900 },
} satisfies ToolExample<Input, Output>;
export const grantDisbursementRetainedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/grant-disbursement-retained-share",
    title: "Grant Disbursement Retained Share",
    description:
      "Partition an explicit grant disbursement using a supplied retention fraction without selecting grant conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossDisbursement: { type: "number", minimum: 0 },
        suppliedRetainedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossDisbursement", "suppliedRetainedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedAmount: { type: "number" },
        paidAmount: { type: "number" },
      },
      required: ["retainedAmount", "paidAmount"],
    },
    ports: {
      inputs: [
        {
          id: "grossDisbursement",
          label: "Gross Disbursement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRetainedFraction",
          label: "Supplied Retained Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedAmount",
          label: "Retained Amount",
          valueType: { type: "number" },
        },
        {
          id: "paidAmount",
          label: "Paid Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = grantDisbursementRetainedShareTool.execute;
export default grantDisbursementRetainedShareTool;
