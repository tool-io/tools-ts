import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentCode: string;
  readonly fieldNumber: number;
  readonly componentNumber: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentCode: { type: "string", maxLength: 8192 },
    fieldNumber: { type: "integer", minimum: 1 },
    componentNumber: { type: "integer", minimum: 1 },
  },
  required: ["segmentCode", "fieldNumber", "componentNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format an explicit HL7 v2 segment-field-component locator without parsing messages or validating field definitions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentCode, fieldNumber, componentNumber } = request;
  const compute = (): Output => {
    H.domain(/^[A-Z][A-Z0-9]{2}(?![\s\S])/.test(segmentCode), "segmentCode");
    (H.domain(
      Number.isSafeInteger(fieldNumber) &&
        fieldNumber >= 1 &&
        fieldNumber <= Number.MAX_SAFE_INTEGER,
      "fieldNumber",
    ),
      fieldNumber);
    (H.domain(
      Number.isSafeInteger(componentNumber) &&
        componentNumber >= 1 &&
        componentNumber <= Number.MAX_SAFE_INTEGER,
      "componentNumber",
    ),
      componentNumber);
    return { token: segmentCode + "-" + fieldNumber + "." + componentNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentCode: "PID", fieldNumber: 3, componentNumber: 1 },
  output: { token: "PID-3.1" },
} satisfies ToolExample<Input, Output>;
export const hl7FieldComponentTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "health-informatics",
        "health informatics",
        "research and quality management",
      ],
      keywords: ["health informatics", "research and quality management"],
    },
    id: "health-informatics/hl7-field-component-token",
    title: "HL7 Field Component Token",
    description:
      "Format an explicit HL7 v2 segment-field-component locator without parsing messages or validating field definitions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentCode: { type: "string", maxLength: 8192 },
        fieldNumber: { type: "integer", minimum: 1 },
        componentNumber: { type: "integer", minimum: 1 },
      },
      required: ["segmentCode", "fieldNumber", "componentNumber"],
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
          id: "segmentCode",
          label: "Segment Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fieldNumber",
          label: "Field Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "componentNumber",
          label: "Component Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hl7FieldComponentTokenTool.execute;
export default hl7FieldComponentTokenTool;
