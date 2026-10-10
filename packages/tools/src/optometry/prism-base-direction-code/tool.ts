import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly baseDirectionCode: string;
  readonly suppliedCodes: readonly string[];
};
export type Output = { readonly label: string; readonly recognized: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    baseDirectionCode: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["recordId", "baseDirectionCode", "suppliedCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    recognized: { type: "boolean" },
  },
  required: ["label", "recognized"],
} as const;
/** Label a supplied prism-base code and check an explicit code list without computing or recommending prism correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, baseDirectionCode, suppliedCodes } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && baseDirectionCode.length > 0, "recordId");
    return {
      label: recordId + " [" + baseDirectionCode + "]",
      recognized: suppliedCodes.includes(baseDirectionCode),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "P17",
    baseDirectionCode: "BI",
    suppliedCodes: ["BI", "BO"],
  },
  output: { label: "P17 [BI]", recognized: true },
} satisfies ToolExample<Input, Output>;
export const prismBaseDirectionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["optometry", "health and medicine"],
      keywords: ["optometry", "health and medicine"],
    },
    id: "optometry/prism-base-direction-code",
    title: "Prism Base Direction Code",
    description:
      "Label a supplied prism-base code and check an explicit code list without computing or recommending prism correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        baseDirectionCode: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["recordId", "baseDirectionCode", "suppliedCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        recognized: { type: "boolean" },
      },
      required: ["label", "recognized"],
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
          id: "baseDirectionCode",
          label: "Base Direction Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCodes",
          label: "Supplied Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = prismBaseDirectionCodeTool.execute;
export default prismBaseDirectionCodeTool;
