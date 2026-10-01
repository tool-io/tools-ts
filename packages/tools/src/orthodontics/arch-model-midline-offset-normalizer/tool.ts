import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upperMidline: number;
  readonly lowerMidline: number;
  readonly referenceMidline: number;
  readonly referenceWidth: number;
};
export type Output = {
  readonly upperOffset: number;
  readonly lowerOffset: number;
  readonly relativeOffset: number;
  readonly normalizedOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperMidline: { type: "number" },
    lowerMidline: { type: "number" },
    referenceMidline: { type: "number" },
    referenceWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "upperMidline",
    "lowerMidline",
    "referenceMidline",
    "referenceWidth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperOffset: { type: "number" },
    lowerOffset: { type: "number" },
    relativeOffset: { type: "number" },
    normalizedOffset: { type: "number" },
  },
  required: [
    "upperOffset",
    "lowerOffset",
    "relativeOffset",
    "normalizedOffset",
  ],
} as const;
/** Calculate arch model midline offset normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upperMidline, lowerMidline, referenceMidline, referenceWidth } =
    request;
  const compute = (): Output => {
    H.positive(referenceWidth);
    return {
      upperOffset: upperMidline - referenceMidline,
      lowerOffset: lowerMidline - referenceMidline,
      relativeOffset: upperMidline - lowerMidline,
      normalizedOffset: (upperMidline - lowerMidline) / referenceWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    upperMidline: 3,
    lowerMidline: 1,
    referenceMidline: 0,
    referenceWidth: 20,
  },
  output: {
    upperOffset: 3,
    lowerOffset: 1,
    relativeOffset: 2,
    normalizedOffset: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const archModelMidlineOffsetNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/arch-model-midline-offset-normalizer",
    title: "Arch Model Midline Offset Normalizer Tool",
    description:
      "Calculate arch model midline offset normalizer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upperMidline: { type: "number" },
        lowerMidline: { type: "number" },
        referenceMidline: { type: "number" },
        referenceWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "upperMidline",
        "lowerMidline",
        "referenceMidline",
        "referenceWidth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upperOffset: { type: "number" },
        lowerOffset: { type: "number" },
        relativeOffset: { type: "number" },
        normalizedOffset: { type: "number" },
      },
      required: [
        "upperOffset",
        "lowerOffset",
        "relativeOffset",
        "normalizedOffset",
      ],
    },
    ports: {
      inputs: [
        {
          id: "upperMidline",
          label: "Upper Midline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerMidline",
          label: "Lower Midline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMidline",
          label: "Reference Midline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceWidth",
          label: "Reference Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "upperOffset",
          label: "Upper Offset",
          valueType: { type: "number" },
        },
        {
          id: "lowerOffset",
          label: "Lower Offset",
          valueType: { type: "number" },
        },
        {
          id: "relativeOffset",
          label: "Relative Offset",
          valueType: { type: "number" },
        },
        {
          id: "normalizedOffset",
          label: "Normalized Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = archModelMidlineOffsetNormalizerTool.execute;
export default archModelMidlineOffsetNormalizerTool;
