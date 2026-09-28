import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDegree: number;
  readonly secondDegree: number;
};
export type Output = { readonly productDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDegree: { type: "integer", minimum: 0 },
    secondDegree: { type: "integer", minimum: 0 },
  },
  required: ["firstDegree", "secondDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { productDecimal: { type: "string", maxLength: 8192 } },
  required: ["productDecimal"],
} as const;
/** Calculate edge endpoint degree product from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDegree, secondDegree } = request;
  const compute = (): Output => {
    H.integer(firstDegree, 0);
    H.integer(secondDegree, 0);
    return {
      productDecimal: (BigInt(firstDegree) * BigInt(secondDegree)).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDegree: 3, secondDegree: 5 },
  output: { productDecimal: "15" },
} satisfies ToolExample<Input, Output>;
export const edgeEndpointDegreeProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/edge-endpoint-degree-product",
    title: "Edge Endpoint Degree Product Tool",
    description:
      "Calculate edge endpoint degree product from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDegree: { type: "integer", minimum: 0 },
        secondDegree: { type: "integer", minimum: 0 },
      },
      required: ["firstDegree", "secondDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { productDecimal: { type: "string", maxLength: 8192 } },
      required: ["productDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "firstDegree",
          label: "First Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondDegree",
          label: "Second Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "productDecimal",
          label: "Product Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = edgeEndpointDegreeProductTool.execute;
export default edgeEndpointDegreeProductTool;
