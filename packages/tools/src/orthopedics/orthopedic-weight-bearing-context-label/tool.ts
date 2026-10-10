import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly instructionWording: string;
  readonly instructionSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    instructionWording: { type: "string", maxLength: 8192, minLength: 1 },
    instructionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "instructionWording", "instructionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Quote a supplied weight-bearing instruction and source without generating or assessing an instruction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, instructionWording, instructionSource } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 &&
        instructionWording.length > 0 &&
        instructionSource.length > 0,
      "recordId",
    );
    return {
      label:
        recordId +
        "; " +
        JSON.stringify(instructionWording) +
        " [" +
        instructionSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    instructionWording: "recorded instruction A",
    instructionSource: "Clinician record",
  },
  output: { label: 'R17; "recorded instruction A" [Clinician record]' },
} satisfies ToolExample<Input, Output>;
export const orthopedicWeightBearingContextLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["orthopedics", "health and medicine"],
        keywords: ["orthopedics", "health and medicine"],
      },
      id: "orthopedics/orthopedic-weight-bearing-context-label",
      title: "Orthopedic Weight Bearing Context Label",
      description:
        "Quote a supplied weight-bearing instruction and source without generating or assessing an instruction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          instructionWording: { type: "string", maxLength: 8192, minLength: 1 },
          instructionSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "instructionWording", "instructionSource"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
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
            id: "instructionWording",
            label: "Instruction Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "instructionSource",
            label: "Instruction Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = orthopedicWeightBearingContextLabelTool.execute;
export default orthopedicWeightBearingContextLabelTool;
