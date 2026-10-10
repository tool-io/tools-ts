import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedEchelonCode: string;
  readonly historicalSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedEchelonCode: { type: "string", maxLength: 8192, minLength: 1 },
    historicalSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedEchelonCode", "historicalSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit historical unit-echelon code by source without mapping current organization or operations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedEchelonCode, historicalSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedEchelonCode.length > 0, "suppliedEchelonCode");
    H.domain(historicalSource.length > 0, "historicalSource");
    return {
      token: JSON.stringify([recordId, suppliedEchelonCode, historicalSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedEchelonCode: "EC2",
    historicalSource: "Archive A",
  },
  output: { token: '["R17","EC2","Archive A"]' },
} satisfies ToolExample<Input, Output>;
export const historicalUnitEchelonSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["military-science", "military science", "social sciences"],
      keywords: ["military science", "social sciences"],
    },
    id: "military-science/historical-unit-echelon-source-code",
    title: "Historical Unit Echelon Source Code",
    description:
      "Qualify an explicit historical unit-echelon code by source without mapping current organization or operations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedEchelonCode: { type: "string", maxLength: 8192, minLength: 1 },
        historicalSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedEchelonCode", "historicalSource"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedEchelonCode",
          label: "Supplied Echelon Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "historicalSource",
          label: "Historical Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalUnitEchelonSourceCodeTool.execute;
export default historicalUnitEchelonSourceCodeTool;
