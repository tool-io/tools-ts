import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly recordedLocationPrecision: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedLocationPrecision: {
      type: "string",
      maxLength: 8192,
      enum: ["exact", "generalized", "withheld", "unknown"],
    },
  },
  required: ["sourceId", "recordedLocationPrecision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied source-location precision policy without revealing, deriving, or obscuring coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, recordedLocationPrecision } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(
      ["exact", "generalized", "withheld", "unknown"].includes(
        recordedLocationPrecision,
      ),
      "recordedLocationPrecision",
    );
    return { label: sourceId + " [" + recordedLocationPrecision + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "S17", recordedLocationPrecision: "withheld" },
  output: { label: "S17 [withheld]" },
} satisfies ToolExample<Input, Output>;
export const indigenousSourceLocationObscurityTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["indigenous-studies", "indigenous studies", "humanities"],
        keywords: ["indigenous studies", "humanities"],
      },
      id: "indigenous-studies/indigenous-source-location-obscurity-tag",
      title: "Indigenous Source Location Obscurity Tag",
      description:
        "Label an explicitly supplied source-location precision policy without revealing, deriving, or obscuring coordinates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedLocationPrecision: {
            type: "string",
            maxLength: 8192,
            enum: ["exact", "generalized", "withheld", "unknown"],
          },
        },
        required: ["sourceId", "recordedLocationPrecision"],
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
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "recordedLocationPrecision",
            label: "Recorded Location Precision",
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
export const run = indigenousSourceLocationObscurityTagTool.execute;
export default indigenousSourceLocationObscurityTagTool;
