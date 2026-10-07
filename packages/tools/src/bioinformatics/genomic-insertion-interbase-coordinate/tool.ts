import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leftBaseOneBased: number };
export type Output = { readonly interbaseZeroBased: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leftBaseOneBased: { type: "integer", minimum: 0 } },
  required: ["leftBaseOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { interbaseZeroBased: { type: "integer" } },
  required: ["interbaseZeroBased"],
} as const;
/** Represent an insertion after the supplied one-based left base as a zero-based interbase boundary; zero denotes before the first base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftBaseOneBased } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(leftBaseOneBased) &&
        leftBaseOneBased >= 0 &&
        leftBaseOneBased <= Number.MAX_SAFE_INTEGER,
      "leftBaseOneBased",
    ),
      leftBaseOneBased);
    return { interbaseZeroBased: leftBaseOneBased };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftBaseOneBased: 100 },
  output: { interbaseZeroBased: 100 },
} satisfies ToolExample<Input, Output>;
export const genomicInsertionInterbaseCoordinateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["bioinformatics", "biology"],
        keywords: ["bioinformatics", "biology"],
      },
      id: "bioinformatics/genomic-insertion-interbase-coordinate",
      title: "Genomic Insertion Interbase Coordinate",
      description:
        "Represent an insertion after the supplied one-based left base as a zero-based interbase boundary; zero denotes before the first base.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { leftBaseOneBased: { type: "integer", minimum: 0 } },
        required: ["leftBaseOneBased"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { interbaseZeroBased: { type: "integer" } },
        required: ["interbaseZeroBased"],
      },
      ports: {
        inputs: [
          {
            id: "leftBaseOneBased",
            label: "Left Base One Based",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "interbaseZeroBased",
            label: "Interbase Zero Based",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = genomicInsertionInterbaseCoordinateTool.execute;
export default genomicInsertionInterbaseCoordinateTool;
