import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCode: string;
  readonly inventoryCodes: readonly string[];
  readonly retiredCodes: readonly string[];
  readonly caseSensitive: boolean;
};
export type Output = {
  readonly present: boolean;
  readonly retired: boolean;
  readonly normalizedCode: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCode: { type: "string", maxLength: 8192 },
    inventoryCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    retiredCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
  },
  required: ["recordCode", "inventoryCodes", "retiredCodes", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "boolean" },
    retired: { type: "boolean" },
    normalizedCode: { type: "string", maxLength: 8192 },
  },
  required: ["present", "retired", "normalizedCode"],
} as const;
/** Match supplied equipment-record codes under an explicit case policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordCode, inventoryCodes, retiredCodes, caseSensitive } = request;
  const compute = (): Output => {
    const normalize = (x: string) => (caseSensitive ? x : x.toUpperCase());
    const normalizedCode = normalize(recordCode);
    H.domain(recordCode.length > 0, "recordCode");
    return {
      present: inventoryCodes.map(normalize).includes(normalizedCode),
      retired: retiredCodes.map(normalize).includes(normalizedCode),
      normalizedCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordCode: "lift-a",
    inventoryCodes: ["LIFT-A", "LIFT-B"],
    retiredCodes: [],
    caseSensitive: false,
  },
  output: { present: true, retired: false, normalizedCode: "LIFT-A" },
} satisfies ToolExample<Input, Output>;
export const assistiveTransferRecordEquipmentCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nursing/assistive-transfer-record-equipment-code",
      title: "Assistive Transfer Record Equipment Code Tool",
      description:
        "Match supplied equipment-record codes under an explicit case policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordCode: { type: "string", maxLength: 8192 },
          inventoryCodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          retiredCodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          caseSensitive: { type: "boolean" },
        },
        required: [
          "recordCode",
          "inventoryCodes",
          "retiredCodes",
          "caseSensitive",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          present: { type: "boolean" },
          retired: { type: "boolean" },
          normalizedCode: { type: "string", maxLength: 8192 },
        },
        required: ["present", "retired", "normalizedCode"],
      },
      ports: {
        inputs: [
          {
            id: "recordCode",
            label: "Record Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "inventoryCodes",
            label: "Inventory Codes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "retiredCodes",
            label: "Retired Codes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "caseSensitive",
            label: "Case Sensitive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "present", label: "Present", valueType: { type: "boolean" } },
          { id: "retired", label: "Retired", valueType: { type: "boolean" } },
          {
            id: "normalizedCode",
            label: "Normalized Code",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = assistiveTransferRecordEquipmentCodeTool.execute;
export default assistiveTransferRecordEquipmentCodeTool;
