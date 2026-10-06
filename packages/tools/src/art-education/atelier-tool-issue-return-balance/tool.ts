import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingStock: number;
  readonly returnedTools: number;
  readonly issuedTools: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingStock: { type: "integer", minimum: 0 },
    returnedTools: { type: "integer", minimum: 0 },
    issuedTools: { type: "integer", minimum: 0 },
  },
  required: ["openingStock", "returnedTools", "issuedTools"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit atelier tool stock, return and issue counts, preserving shortages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingStock, returnedTools, issuedTools } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingStock) &&
        openingStock >= 0 &&
        openingStock <= Number.MAX_SAFE_INTEGER,
      "openingStock",
    ),
      openingStock);
    (H.domain(
      Number.isSafeInteger(returnedTools) &&
        returnedTools >= 0 &&
        returnedTools <= Number.MAX_SAFE_INTEGER,
      "returnedTools",
    ),
      returnedTools);
    (H.domain(
      Number.isSafeInteger(issuedTools) &&
        issuedTools >= 0 &&
        issuedTools <= Number.MAX_SAFE_INTEGER,
      "issuedTools",
    ),
      issuedTools);
    return {
      closingBalance: Number(
        BigInt(openingStock) + BigInt(returnedTools) - BigInt(issuedTools),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingStock: 20, returnedTools: 8, issuedTools: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const atelierToolIssueReturnBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/atelier-tool-issue-return-balance",
    title: "Atelier Tool Issue Return Balance",
    description:
      "Reconcile explicit atelier tool stock, return and issue counts, preserving shortages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingStock: { type: "integer", minimum: 0 },
        returnedTools: { type: "integer", minimum: 0 },
        issuedTools: { type: "integer", minimum: 0 },
      },
      required: ["openingStock", "returnedTools", "issuedTools"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingBalance: { type: "integer" } },
      required: ["closingBalance"],
    },
    ports: {
      inputs: [
        {
          id: "openingStock",
          label: "Opening Stock",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returnedTools",
          label: "Returned Tools",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issuedTools",
          label: "Issued Tools",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "closingBalance",
          label: "Closing Balance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = atelierToolIssueReturnBalanceTool.execute;
export default atelierToolIssueReturnBalanceTool;
