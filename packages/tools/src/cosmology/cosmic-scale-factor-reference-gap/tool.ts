import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly redshift: number;
  readonly referenceScaleFactor: number;
  readonly suppliedNormalization: number;
};
export type Output = { readonly scaleFactor: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redshift: { type: "number", exclusiveMinimum: -1 },
    referenceScaleFactor: { type: "number", exclusiveMinimum: 0 },
    suppliedNormalization: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["redshift", "referenceScaleFactor", "suppliedNormalization"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaleFactor: { type: "number" }, gap: { type: "number" } },
  required: ["scaleFactor", "gap"],
} as const;
/** Convert a supplied redshift using an explicit scale-factor normalization; no cosmological parameters or distances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { redshift, referenceScaleFactor, suppliedNormalization } = request;
  const compute = (): Output => {
    H.domain(redshift > -1);
    H.positive(referenceScaleFactor);
    H.positive(suppliedNormalization);
    return {
      scaleFactor: suppliedNormalization / (1 + redshift),
      gap: suppliedNormalization / (1 + redshift) - referenceScaleFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { redshift: 1, referenceScaleFactor: 0.4, suppliedNormalization: 1 },
  output: { scaleFactor: 0.5, gap: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const cosmicScaleFactorReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/cosmic-scale-factor-reference-gap",
    title: "Cosmic Scale Factor Reference Gap Tool",
    description:
      "Convert a supplied redshift using an explicit scale-factor normalization; no cosmological parameters or distances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        redshift: { type: "number", exclusiveMinimum: -1 },
        referenceScaleFactor: { type: "number", exclusiveMinimum: 0 },
        suppliedNormalization: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["redshift", "referenceScaleFactor", "suppliedNormalization"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaleFactor: { type: "number" }, gap: { type: "number" } },
      required: ["scaleFactor", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "redshift",
          label: "Redshift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceScaleFactor",
          label: "Reference Scale Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedNormalization",
          label: "Supplied Normalization",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaleFactor",
          label: "Scale Factor",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cosmicScaleFactorReferenceGapTool.execute;
export default cosmicScaleFactorReferenceGapTool;
