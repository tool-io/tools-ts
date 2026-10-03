import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly meanX: number;
  readonly y: number;
  readonly meanY: number;
};
export type Output = { readonly product: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    meanX: { type: "number" },
    y: { type: "number" },
    meanY: { type: "number" },
  },
  required: ["x", "meanX", "y", "meanY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { product: { type: "number" }, sign: { type: "integer" } },
  required: ["product", "sign"],
} as const;
/** Calculate covariance one pair sign contribution from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, meanX, y, meanY } = input;
  const compute = (): Output => {
    const product = (x - meanX) * (y - meanY);
    return { product, sign: Math.sign(product) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 5, meanX: 3, y: 1, meanY: 4 },
  output: { product: -6, sign: -1 },
} satisfies ToolExample<Input, Output>;
export const covarianceOnePairSignContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/covariance-one-pair-sign-contribution",
    title: "Covariance One Pair Sign Contribution Tool",
    description:
      "Calculate covariance one pair sign contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        meanX: { type: "number" },
        y: { type: "number" },
        meanY: { type: "number" },
      },
      required: ["x", "meanX", "y", "meanY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { product: { type: "number" }, sign: { type: "integer" } },
      required: ["product", "sign"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "meanX",
          label: "Mean X",
          required: true,
          valueType: { type: "number" },
        },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
        {
          id: "meanY",
          label: "Mean Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "product", label: "Product", valueType: { type: "number" } },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = covarianceOnePairSignContributionTool.execute;
export default covarianceOnePairSignContributionTool;
