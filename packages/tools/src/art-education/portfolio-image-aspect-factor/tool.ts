import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly referenceAspect: number;
};
export type Output = { readonly aspect: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
    referenceAspect: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["width", "height", "referenceAspect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { aspect: { type: "number" }, factor: { type: "number" } },
  required: ["aspect", "factor"],
} as const;
/** Calculate portfolio image aspect factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, referenceAspect } = request;
  const compute = (): Output => {
    H.positive(width);
    H.positive(height);
    H.positive(referenceAspect);
    return { aspect: width / height, factor: width / height / referenceAspect };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 600, height: 400, referenceAspect: 1 },
  output: { aspect: 1.5, factor: 1.5 },
} satisfies ToolExample<Input, Output>;
export const portfolioImageAspectFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/portfolio-image-aspect-factor",
    title: "Portfolio Image Aspect Factor Tool",
    description:
      "Calculate portfolio image aspect factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", exclusiveMinimum: 0 },
        height: { type: "number", exclusiveMinimum: 0 },
        referenceAspect: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["width", "height", "referenceAspect"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { aspect: { type: "number" }, factor: { type: "number" } },
      required: ["aspect", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAspect",
          label: "Reference Aspect",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "aspect", label: "Aspect", valueType: { type: "number" } },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = portfolioImageAspectFactorTool.execute;
export default portfolioImageAspectFactorTool;
