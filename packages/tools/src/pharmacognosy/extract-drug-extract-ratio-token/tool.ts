import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly extractId: string;
  readonly printedRatio: string;
  readonly ratioBasis: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extractId: { type: "string", maxLength: 8192, minLength: 1 },
    printedRatio: { type: "string", maxLength: 8192, minLength: 1 },
    ratioBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["extractId", "printedRatio", "ratioBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit drug-extract ratio and basis wording without inferring equivalence or dosage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { extractId, printedRatio, ratioBasis } = request;
  const compute = (): Output => {
    H.domain(extractId.length > 0, "extractId");
    H.domain(printedRatio.length > 0, "printedRatio");
    H.domain(ratioBasis.length > 0, "ratioBasis");
    return { token: JSON.stringify([extractId, printedRatio, ratioBasis]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    extractId: "EX17",
    printedRatio: "5:1",
    ratioBasis: "dry input:extract",
  },
  output: { token: '["EX17","5:1","dry input:extract"]' },
} satisfies ToolExample<Input, Output>;
export const extractDrugExtractRatioTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacognosy", "pharmacy"],
      keywords: ["pharmacognosy", "pharmacy"],
    },
    id: "pharmacognosy/extract-drug-extract-ratio-token",
    title: "Extract Drug Extract Ratio Token",
    description:
      "Preserve an explicit drug-extract ratio and basis wording without inferring equivalence or dosage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extractId: { type: "string", maxLength: 8192, minLength: 1 },
        printedRatio: { type: "string", maxLength: 8192, minLength: 1 },
        ratioBasis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["extractId", "printedRatio", "ratioBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "extractId",
          label: "Extract Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "printedRatio",
          label: "Printed Ratio",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ratioBasis",
          label: "Ratio Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = extractDrugExtractRatioTokenTool.execute;
export default extractDrugExtractRatioTokenTool;
