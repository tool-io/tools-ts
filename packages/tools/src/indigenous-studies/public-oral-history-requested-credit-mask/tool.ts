import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedCredit: string;
  readonly requestedMaskText: string;
  readonly maskRequested: boolean;
};
export type Output = { readonly displayCredit: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedCredit: { type: "string", maxLength: 8192 },
    requestedMaskText: { type: "string", maxLength: 8192, minLength: 1 },
    maskRequested: { type: "boolean" },
  },
  required: ["suppliedCredit", "requestedMaskText", "maskRequested"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayCredit: { type: "string", maxLength: 8192 } },
  required: ["displayCredit"],
} as const;
/** Choose an explicit oral-history credit or requested mask without deciding permission or guaranteeing anonymity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedCredit, requestedMaskText, maskRequested } = request;
  const compute = (): Output => {
    H.domain(requestedMaskText.length > 0, "requestedMaskText");
    return {
      displayCredit: maskRequested ? requestedMaskText : suppliedCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedCredit: "Credit A",
    requestedMaskText: "[credit withheld]",
    maskRequested: true,
  },
  output: { displayCredit: "[credit withheld]" },
} satisfies ToolExample<Input, Output>;
export const publicOralHistoryRequestedCreditMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["indigenous-studies", "indigenous studies", "humanities"],
        keywords: ["indigenous studies", "humanities"],
      },
      id: "indigenous-studies/public-oral-history-requested-credit-mask",
      title: "Public Oral History Requested Credit Mask",
      description:
        "Choose an explicit oral-history credit or requested mask without deciding permission or guaranteeing anonymity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          suppliedCredit: { type: "string", maxLength: 8192 },
          requestedMaskText: { type: "string", maxLength: 8192, minLength: 1 },
          maskRequested: { type: "boolean" },
        },
        required: ["suppliedCredit", "requestedMaskText", "maskRequested"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { displayCredit: { type: "string", maxLength: 8192 } },
        required: ["displayCredit"],
      },
      ports: {
        inputs: [
          {
            id: "suppliedCredit",
            label: "Supplied Credit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "requestedMaskText",
            label: "Requested Mask Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "maskRequested",
            label: "Mask Requested",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "displayCredit",
            label: "Display Credit",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicOralHistoryRequestedCreditMaskTool.execute;
export default publicOralHistoryRequestedCreditMaskTool;
