import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstContour: number;
  readonly secondContour: number;
  readonly contourInterval: number;
};
export type Output = { readonly heightDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstContour: { type: "integer" },
    secondContour: { type: "integer" },
    contourInterval: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstContour", "secondContour", "contourInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heightDifference: { type: "number" } },
  required: ["heightDifference"],
} as const;
/** Translate supplied signed contour-index differences using an explicit height interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstContour, secondContour, contourInterval } = request;
  const compute = (): Output => {
    H.positive(contourInterval);
    return {
      heightDifference:
        Number(BigInt(secondContour) - BigInt(firstContour)) * contourInterval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstContour: 2, secondContour: 5, contourInterval: 0.5 },
  output: { heightDifference: 1.5 },
} satisfies ToolExample<Input, Output>;
export const siteContourHeightStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/site-contour-height-step",
    title: "Site Contour Height Step Tool",
    description:
      "Translate supplied signed contour-index differences using an explicit height interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstContour: { type: "integer" },
        secondContour: { type: "integer" },
        contourInterval: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstContour", "secondContour", "contourInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heightDifference: { type: "number" } },
      required: ["heightDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstContour",
          label: "First Contour",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondContour",
          label: "Second Contour",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contourInterval",
          label: "Contour Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightDifference",
          label: "Height Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = siteContourHeightStepTool.execute;
export default siteContourHeightStepTool;
