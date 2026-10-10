import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly passageId: string;
  readonly suppliedReadingLabel: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    passageId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReadingLabel: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["passageId", "suppliedReadingLabel", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit Quran reading-variant attribution and source without selecting a canonical reading or quoting religious text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { passageId, suppliedReadingLabel, sourceId } = request;
  const compute = (): Output => {
    H.domain(passageId.length > 0, "passageId");
    H.domain(suppliedReadingLabel.length > 0, "suppliedReadingLabel");
    H.domain(sourceId.length > 0, "sourceId");
    return {
      token: JSON.stringify([passageId, suppliedReadingLabel, sourceId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    passageId: "P17",
    suppliedReadingLabel: "reading label A",
    sourceId: "S4",
  },
  output: { token: '["P17","reading label A","S4"]' },
} satisfies ToolExample<Input, Output>;
export const quranReadingVariantSourceAttributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "islamic-studies/quran-reading-variant-source-attribution",
      title: "Quran Reading Variant Source Attribution Tool",
      description:
        "Record an explicit Quran reading-variant attribution and source without selecting a canonical reading or quoting religious text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          passageId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedReadingLabel: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["passageId", "suppliedReadingLabel", "sourceId"],
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
            id: "passageId",
            label: "Passage Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedReadingLabel",
            label: "Supplied Reading Label",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceId",
            label: "Source Id",
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
export const run = quranReadingVariantSourceAttributionTool.execute;
export default quranReadingVariantSourceAttributionTool;
