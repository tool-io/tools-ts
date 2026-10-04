import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly legumeYears: number;
  readonly partialYears: number;
  readonly partialShare: number;
  readonly rotationYears: number;
};
export type Output = {
  readonly effectiveYears: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    legumeYears: { type: "number", minimum: 0 },
    partialYears: { type: "number", minimum: 0 },
    partialShare: { type: "number", minimum: 0, maximum: 1 },
    rotationYears: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["legumeYears", "partialYears", "partialShare", "rotationYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveYears: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["effectiveYears", "fraction"],
} as const;
/** Calculate crop rotation legume year fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { legumeYears, partialYears, partialShare, rotationYears } = request;
  const compute = (): Output => {
    H.positive(rotationYears);
    H.domain(
      legumeYears >= 0 &&
        partialYears >= 0 &&
        legumeYears + partialYears <= rotationYears,
    );
    H.probability(partialShare);
    return {
      effectiveYears: legumeYears + partialYears * partialShare,
      fraction: (legumeYears + partialYears * partialShare) / rotationYears,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    legumeYears: 2,
    partialYears: 1,
    partialShare: 0.5,
    rotationYears: 5,
  },
  output: { effectiveYears: 2.5, fraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const cropRotationLegumeYearFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/crop-rotation-legume-year-fraction",
    title: "Crop Rotation Legume Year Fraction Tool",
    description:
      "Calculate crop rotation legume year fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        legumeYears: { type: "number", minimum: 0 },
        partialYears: { type: "number", minimum: 0 },
        partialShare: { type: "number", minimum: 0, maximum: 1 },
        rotationYears: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "legumeYears",
        "partialYears",
        "partialShare",
        "rotationYears",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveYears: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["effectiveYears", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "legumeYears",
          label: "Legume Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partialYears",
          label: "Partial Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partialShare",
          label: "Partial Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "rotationYears",
          label: "Rotation Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveYears",
          label: "Effective Years",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cropRotationLegumeYearFractionTool.execute;
export default cropRotationLegumeYearFractionTool;
