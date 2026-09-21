import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly relaxedLength: number;
  readonly extendedLength: number;
  readonly processingRetention: number;
};
export type Output = {
  readonly extensionFraction: number;
  readonly processedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relaxedLength: { type: "number", exclusiveMinimum: 0 },
    extendedLength: { type: "number" },
    processingRetention: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["relaxedLength", "extendedLength", "processingRetention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extensionFraction: { type: "number" },
    processedLength: { type: "number" },
  },
  required: ["extensionFraction", "processedLength"],
} as const;
/** Calculate wool staple length shrink factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { relaxedLength, extendedLength, processingRetention } = request;
  const compute = (): Output => {
    H.positive(relaxedLength);
    H.domain(extendedLength >= relaxedLength);
    H.probability(processingRetention);
    return {
      extensionFraction: (extendedLength - relaxedLength) / relaxedLength,
      processedLength: extendedLength * processingRetention,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { relaxedLength: 8, extendedLength: 10, processingRetention: 0.9 },
  output: { extensionFraction: 0.25, processedLength: 9 },
} satisfies ToolExample<Input, Output>;
export const woolStapleLengthShrinkFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/wool-staple-length-shrink-factor",
    title: "Wool Staple Length Shrink Factor Tool",
    description:
      "Calculate wool staple length shrink factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relaxedLength: { type: "number", exclusiveMinimum: 0 },
        extendedLength: { type: "number" },
        processingRetention: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["relaxedLength", "extendedLength", "processingRetention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extensionFraction: { type: "number" },
        processedLength: { type: "number" },
      },
      required: ["extensionFraction", "processedLength"],
    },
    ports: {
      inputs: [
        {
          id: "relaxedLength",
          label: "Relaxed Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extendedLength",
          label: "Extended Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "processingRetention",
          label: "Processing Retention",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "extensionFraction",
          label: "Extension Fraction",
          valueType: { type: "number" },
        },
        {
          id: "processedLength",
          label: "Processed Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = woolStapleLengthShrinkFactorTool.execute;
export default woolStapleLengthShrinkFactorTool;
