import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prebleach: number;
  readonly postbleach: number;
  readonly plateau: number;
  readonly background: number;
};
export type Output = {
  readonly mobileFraction: number;
  readonly normalizedPostbleach: number;
  readonly normalizedPlateau: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prebleach: { type: "number" },
    postbleach: { type: "number" },
    plateau: { type: "number" },
    background: { type: "number" },
  },
  required: ["prebleach", "postbleach", "plateau", "background"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mobileFraction: { type: "number" },
    normalizedPostbleach: { type: "number" },
    normalizedPlateau: { type: "number" },
  },
  required: ["mobileFraction", "normalizedPostbleach", "normalizedPlateau"],
} as const;
/** Simple background-corrected FRAP intensity normalization without ongoing photobleaching or reference-region correction; out-of-range fractions remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prebleach, postbleach, plateau, background } = request;
  const compute = (): Output => {
    H.domain(prebleach !== postbleach && prebleach !== background);
    return {
      mobileFraction: (plateau - postbleach) / (prebleach - postbleach),
      normalizedPostbleach:
        (postbleach - background) / (prebleach - background),
      normalizedPlateau: (plateau - background) / (prebleach - background),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prebleach: 100, postbleach: 20, plateau: 80, background: 0 },
  output: {
    mobileFraction: 0.75,
    normalizedPostbleach: 0.2,
    normalizedPlateau: 0.8,
  },
} satisfies ToolExample<Input, Output>;
export const diffusionFrapMobileFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/diffusion-frap-mobile-fraction-term",
    title: "Diffusion Frap Mobile Fraction Term Tool",
    description:
      "Simple background-corrected FRAP intensity normalization without ongoing photobleaching or reference-region correction; out-of-range fractions remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prebleach: { type: "number" },
        postbleach: { type: "number" },
        plateau: { type: "number" },
        background: { type: "number" },
      },
      required: ["prebleach", "postbleach", "plateau", "background"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mobileFraction: { type: "number" },
        normalizedPostbleach: { type: "number" },
        normalizedPlateau: { type: "number" },
      },
      required: ["mobileFraction", "normalizedPostbleach", "normalizedPlateau"],
    },
    ports: {
      inputs: [
        {
          id: "prebleach",
          label: "Prebleach",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "postbleach",
          label: "Postbleach",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plateau",
          label: "Plateau",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mobileFraction",
          label: "Mobile Fraction",
          valueType: { type: "number" },
        },
        {
          id: "normalizedPostbleach",
          label: "Normalized Postbleach",
          valueType: { type: "number" },
        },
        {
          id: "normalizedPlateau",
          label: "Normalized Plateau",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diffusionFrapMobileFractionTermTool.execute;
export default diffusionFrapMobileFractionTermTool;
