import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageLength: number;
  readonly scaleFactor: number;
  readonly factorIsMagnification: boolean;
};
export type Output = { readonly objectLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageLength: { type: "number", minimum: 0 },
    scaleFactor: { type: "number", exclusiveMinimum: 0 },
    factorIsMagnification: { type: "boolean" },
  },
  required: ["imageLength", "scaleFactor", "factorIsMagnification"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { objectLength: { type: "number" } },
  required: ["objectLength"],
} as const;
/** Apply an explicit magnification-versus-object-per-image scale convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageLength, scaleFactor, factorIsMagnification } = request;
  const compute = (): Output => {
    H.domain(imageLength >= 0);
    H.positive(scaleFactor);
    return {
      objectLength: factorIsMagnification
        ? imageLength / scaleFactor
        : imageLength * scaleFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageLength: 20, scaleFactor: 2, factorIsMagnification: true },
  output: { objectLength: 10 },
} satisfies ToolExample<Input, Output>;
export const rootImageMagnificationBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/root-image-magnification-base-flag",
    title: "Root Image Magnification Base Flag Tool",
    description:
      "Apply an explicit magnification-versus-object-per-image scale convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageLength: { type: "number", minimum: 0 },
        scaleFactor: { type: "number", exclusiveMinimum: 0 },
        factorIsMagnification: { type: "boolean" },
      },
      required: ["imageLength", "scaleFactor", "factorIsMagnification"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { objectLength: { type: "number" } },
      required: ["objectLength"],
    },
    ports: {
      inputs: [
        {
          id: "imageLength",
          label: "Image Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleFactor",
          label: "Scale Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "factorIsMagnification",
          label: "Factor Is Magnification",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "objectLength",
          label: "Object Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rootImageMagnificationBaseFlagTool.execute;
export default rootImageMagnificationBaseFlagTool;
