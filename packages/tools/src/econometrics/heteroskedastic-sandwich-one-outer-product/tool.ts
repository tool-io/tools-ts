import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regressors: readonly number[];
  readonly residual: number;
  readonly weight: number;
};
export type Output = { readonly meat: readonly (readonly number[])[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regressors: { type: "array", maxItems: 256, items: { type: "number" } },
    residual: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["regressors", "residual", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meat: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["meat"],
} as const;
/** One HC0 weighted-score outer-product meat term, without a bread matrix or small-sample correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regressors, residual, weight } = request;
  const compute = (): Output => {
    H.domain(regressors.length > 0 && regressors.length <= 128 && weight >= 0);
    return {
      meat: regressors.map((x) =>
        regressors.map((y) => weight ** 2 * residual ** 2 * x * y),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regressors: [1, 2], residual: 3, weight: 1 },
  output: {
    meat: [
      [9, 18],
      [18, 36],
    ],
  },
} satisfies ToolExample<Input, Output>;
export const heteroskedasticSandwichOneOuterProductTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/heteroskedastic-sandwich-one-outer-product",
      title: "Heteroskedastic Sandwich One Outer Product Tool",
      description:
        "One HC0 weighted-score outer-product meat term, without a bread matrix or small-sample correction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          regressors: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          residual: { type: "number" },
          weight: { type: "number", minimum: 0 },
        },
        required: ["regressors", "residual", "weight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          meat: {
            type: "array",
            maxItems: 128,
            items: { type: "array", maxItems: 128, items: { type: "number" } },
          },
        },
        required: ["meat"],
      },
      ports: {
        inputs: [
          {
            id: "regressors",
            label: "Regressors",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "residual",
            label: "Residual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "meat",
            label: "Meat",
            valueType: {
              type: "list",
              items: { type: "list", items: { type: "number" } },
            },
          },
        ],
      },
    },
    calculate,
  });
export const run = heteroskedasticSandwichOneOuterProductTool.execute;
export default heteroskedasticSandwichOneOuterProductTool;
