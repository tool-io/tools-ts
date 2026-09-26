import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantityBefore: number;
  readonly quantityAfter: number;
  readonly priceBefore: number;
  readonly priceAfter: number;
  readonly elasticity: number;
};
export type Output = {
  readonly quantityLogChange: number;
  readonly predictedLogChange: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantityBefore: { type: "number", exclusiveMinimum: 0 },
    quantityAfter: { type: "number", exclusiveMinimum: 0 },
    priceBefore: { type: "number", exclusiveMinimum: 0 },
    priceAfter: { type: "number", exclusiveMinimum: 0 },
    elasticity: { type: "number" },
  },
  required: [
    "quantityBefore",
    "quantityAfter",
    "priceBefore",
    "priceAfter",
    "elasticity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantityLogChange: { type: "number" },
    predictedLogChange: { type: "number" },
    residual: { type: "number" },
  },
  required: ["quantityLogChange", "predictedLogChange", "residual"],
} as const;
/** Calculate elasticity logchange residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantityBefore, quantityAfter, priceBefore, priceAfter, elasticity } =
    request;
  const compute = (): Output => {
    H.positive(quantityBefore);
    H.positive(quantityAfter);
    H.positive(priceBefore);
    H.positive(priceAfter);
    return {
      quantityLogChange: Math.log(quantityAfter) - Math.log(quantityBefore),
      predictedLogChange:
        elasticity * (Math.log(priceAfter) - Math.log(priceBefore)),
      residual:
        Math.log(quantityAfter) -
        Math.log(quantityBefore) -
        elasticity * (Math.log(priceAfter) - Math.log(priceBefore)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quantityBefore: 1,
    quantityAfter: 2,
    priceBefore: 1,
    priceAfter: 2,
    elasticity: 1,
  },
  output: {
    quantityLogChange: 0.6931471805599453,
    predictedLogChange: 0.6931471805599453,
    residual: 0,
  },
} satisfies ToolExample<Input, Output>;
export const elasticityLogchangeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/elasticity-logchange-residual",
    title: "Elasticity Logchange Residual Tool",
    description:
      "Calculate elasticity logchange residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantityBefore: { type: "number", exclusiveMinimum: 0 },
        quantityAfter: { type: "number", exclusiveMinimum: 0 },
        priceBefore: { type: "number", exclusiveMinimum: 0 },
        priceAfter: { type: "number", exclusiveMinimum: 0 },
        elasticity: { type: "number" },
      },
      required: [
        "quantityBefore",
        "quantityAfter",
        "priceBefore",
        "priceAfter",
        "elasticity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantityLogChange: { type: "number" },
        predictedLogChange: { type: "number" },
        residual: { type: "number" },
      },
      required: ["quantityLogChange", "predictedLogChange", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "quantityBefore",
          label: "Quantity Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantityAfter",
          label: "Quantity After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priceBefore",
          label: "Price Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priceAfter",
          label: "Price After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elasticity",
          label: "Elasticity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "quantityLogChange",
          label: "Quantity Log Change",
          valueType: { type: "number" },
        },
        {
          id: "predictedLogChange",
          label: "Predicted Log Change",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = elasticityLogchangeResidualTool.execute;
export default elasticityLogchangeResidualTool;
