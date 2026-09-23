import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldNames: readonly string[];
  readonly fieldValues: readonly string[];
  readonly permittedFields: readonly string[];
  readonly requiredFields: readonly string[];
};
export type Output = {
  readonly keptNames: readonly string[];
  readonly keptValues: readonly string[];
  readonly omittedNames: readonly string[];
  readonly missingRequired: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    fieldValues: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    permittedFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["fieldNames", "fieldValues", "permittedFields", "requiredFields"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keptNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    keptValues: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    omittedNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingRequired: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["keptNames", "keptValues", "omittedNames", "missingRequired"],
} as const;
/** Apply caller-selected field minimization to supplied benign authorized records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldNames, fieldValues, permittedFields, requiredFields } = request;
  const compute = (): Output => {
    H.sameLength(fieldNames, fieldValues);
    H.domain(new Set(fieldNames).size === fieldNames.length);
    return {
      keptNames: fieldNames.filter((x) => permittedFields.includes(x)),
      keptValues: fieldValues.filter((_, i) =>
        permittedFields.includes(fieldNames[i]),
      ),
      omittedNames: fieldNames.filter((x) => !permittedFields.includes(x)),
      missingRequired: requiredFields.filter(
        (x) => !fieldNames.includes(x) || !permittedFields.includes(x),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fieldNames: ["case", "name", "status"],
    fieldValues: ["C1", "Alex", "open"],
    permittedFields: ["case", "status"],
    requiredFields: ["case"],
  },
  output: {
    keptNames: ["case", "status"],
    keptValues: ["C1", "open"],
    omittedNames: ["name"],
    missingRequired: [],
  },
} satisfies ToolExample<Input, Output>;
export const biosecurityRecordMinimalFieldFilterTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-record-minimal-field-filter",
      title: "Biosecurity Record Minimal Field Filter Tool",
      description:
        "Apply caller-selected field minimization to supplied benign authorized records.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fieldNames: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          fieldValues: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          permittedFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          requiredFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: [
          "fieldNames",
          "fieldValues",
          "permittedFields",
          "requiredFields",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          keptNames: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          keptValues: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          omittedNames: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          missingRequired: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: [
          "keptNames",
          "keptValues",
          "omittedNames",
          "missingRequired",
        ],
      },
      ports: {
        inputs: [
          {
            id: "fieldNames",
            label: "Field Names",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "fieldValues",
            label: "Field Values",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "permittedFields",
            label: "Permitted Fields",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "requiredFields",
            label: "Required Fields",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "keptNames",
            label: "Kept Names",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "keptValues",
            label: "Kept Values",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "omittedNames",
            label: "Omitted Names",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "missingRequired",
            label: "Missing Required",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityRecordMinimalFieldFilterTool.execute;
export default biosecurityRecordMinimalFieldFilterTool;
