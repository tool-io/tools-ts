import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceReading: string;
  readonly suppliedEmendation: string;
  readonly editorialSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceReading: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedEmendation: { type: "string", maxLength: 8192, minLength: 1 },
    editorialSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceReading", "suppliedEmendation", "editorialSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit source and emended readings with editorial provenance without generating an emendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceReading, suppliedEmendation, editorialSource } = request;
  const compute = (): Output => {
    H.domain(sourceReading.length > 0, "sourceReading");
    H.domain(suppliedEmendation.length > 0, "suppliedEmendation");
    H.domain(editorialSource.length > 0, "editorialSource");
    return {
      token: JSON.stringify([
        sourceReading,
        suppliedEmendation,
        editorialSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceReading: "reading A",
    suppliedEmendation: "reading B",
    editorialSource: "Editor A",
  },
  output: { token: '["reading A","reading B","Editor A"]' },
} satisfies ToolExample<Input, Output>;
export const historicalTextEditorialEmendationTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["history", "humanities"],
        keywords: ["history", "humanities"],
      },
      id: "history/historical-text-editorial-emendation-token",
      title: "Historical Text Editorial Emendation Token",
      description:
        "Pair explicit source and emended readings with editorial provenance without generating an emendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceReading: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedEmendation: { type: "string", maxLength: 8192, minLength: 1 },
          editorialSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sourceReading", "suppliedEmendation", "editorialSource"],
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
            id: "sourceReading",
            label: "Source Reading",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedEmendation",
            label: "Supplied Emendation",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "editorialSource",
            label: "Editorial Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = historicalTextEditorialEmendationTokenTool.execute;
export default historicalTextEditorialEmendationTokenTool;
