import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAxis: number;
  readonly secondAxis: number;
  readonly thirdAxis: number;
};
export type Output = { readonly axisProduct: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAxis: { type: "number", minimum: 0 },
    secondAxis: { type: "number", minimum: 0 },
    thirdAxis: { type: "number", minimum: 0 },
  },
  required: ["firstAxis", "secondAxis", "thirdAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { axisProduct: { type: "number" } },
  required: ["axisProduct"],
} as const;
/** Multiply supplied research-image axes; this is not lesion volume, staging or response classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAxis, secondAxis, thirdAxis } = request;
  const compute = (): Output => {
    H.domain(firstAxis >= 0 && secondAxis >= 0 && thirdAxis >= 0);
    return { axisProduct: firstAxis * secondAxis * thirdAxis };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAxis: 2, secondAxis: 3, thirdAxis: 4 },
  output: { axisProduct: 24 },
} satisfies ToolExample<Input, Output>;
export const researchLesionAxisProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/research-lesion-axis-product",
    title: "Research Lesion Axis Product Tool",
    description:
      "Multiply supplied research-image axes; this is not lesion volume, staging or response classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAxis: { type: "number", minimum: 0 },
        secondAxis: { type: "number", minimum: 0 },
        thirdAxis: { type: "number", minimum: 0 },
      },
      required: ["firstAxis", "secondAxis", "thirdAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { axisProduct: { type: "number" } },
      required: ["axisProduct"],
    },
    ports: {
      inputs: [
        {
          id: "firstAxis",
          label: "First Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAxis",
          label: "Second Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thirdAxis",
          label: "Third Axis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "axisProduct",
          label: "Axis Product",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchLesionAxisProductTool.execute;
export default researchLesionAxisProductTool;
