import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerWidth: number;
  readonly outerHeight: number;
  readonly imageWidth: number;
  readonly imageHeight: number;
};
export type Output = {
  readonly outerAspect: number;
  readonly imageAspect: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerWidth: { type: "number" },
    outerHeight: { type: "number", exclusiveMinimum: 0 },
    imageWidth: { type: "number", minimum: 0 },
    imageHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["outerWidth", "outerHeight", "imageWidth", "imageHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerAspect: { type: "number" },
    imageAspect: { type: "number" },
    gap: { type: "number" },
  },
  required: ["outerAspect", "imageAspect", "gap"],
} as const;
/** Calculate print border aspect gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerWidth, outerHeight, imageWidth, imageHeight } = request;
  const compute = (): Output => {
    H.positive(outerHeight);
    H.positive(imageHeight);
    H.domain(
      outerWidth >= imageWidth && outerHeight >= imageHeight && imageWidth >= 0,
    );
    return {
      outerAspect: outerWidth / outerHeight,
      imageAspect: imageWidth / imageHeight,
      gap: outerWidth / outerHeight - imageWidth / imageHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerWidth: 12, outerHeight: 8, imageWidth: 8, imageHeight: 8 },
  output: { outerAspect: 1.5, imageAspect: 1, gap: 0.5 },
} satisfies ToolExample<Input, Output>;
export const printBorderAspectGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/print-border-aspect-gap",
    title: "Print Border Aspect Gap Tool",
    description:
      "Calculate print border aspect gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerWidth: { type: "number" },
        outerHeight: { type: "number", exclusiveMinimum: 0 },
        imageWidth: { type: "number", minimum: 0 },
        imageHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["outerWidth", "outerHeight", "imageWidth", "imageHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerAspect: { type: "number" },
        imageAspect: { type: "number" },
        gap: { type: "number" },
      },
      required: ["outerAspect", "imageAspect", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "outerWidth",
          label: "Outer Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outerHeight",
          label: "Outer Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imageWidth",
          label: "Image Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imageHeight",
          label: "Image Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outerAspect",
          label: "Outer Aspect",
          valueType: { type: "number" },
        },
        {
          id: "imageAspect",
          label: "Image Aspect",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = printBorderAspectGapTool.execute;
export default printBorderAspectGapTool;
