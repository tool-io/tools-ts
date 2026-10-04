import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly third: readonly number[];
  readonly parameter: number;
};
export type Output = {
  readonly residual: readonly number[];
  readonly norm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    third: { type: "array", maxItems: 256, items: { type: "number" } },
    parameter: { type: "number" },
  },
  required: ["first", "second", "third", "parameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "array", maxItems: 256, items: { type: "number" } },
    norm: { type: "number" },
  },
  required: ["residual", "norm"],
} as const;
/** Calculate vector three point affine dependence residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, third, parameter } = input;
  const compute = (): Output => {
    H.sameLength(first, second);
    H.sameLength(first, third);
    const residual = first.map(
      (x, i) => third[i] - (x + parameter * (second[i] - x)),
    );
    return { residual, norm: Math.hypot(...residual) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: [0, 0], second: [2, 4], third: [1, 3], parameter: 0.5 },
  output: { residual: [0, 1], norm: 1 },
} satisfies ToolExample<Input, Output>;
export const vectorThreePointAffineDependenceResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-three-point-affine-dependence-residual",
      title: "Vector Three Point Affine Dependence Residual Tool",
      description:
        "Calculate vector three point affine dependence residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "array", maxItems: 256, items: { type: "number" } },
          second: { type: "array", maxItems: 256, items: { type: "number" } },
          third: { type: "array", maxItems: 256, items: { type: "number" } },
          parameter: { type: "number" },
        },
        required: ["first", "second", "third", "parameter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "array", maxItems: 256, items: { type: "number" } },
          norm: { type: "number" },
        },
        required: ["residual", "norm"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "third",
            label: "Third",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "parameter",
            label: "Parameter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "residual",
            label: "Residual",
            valueType: { type: "list", items: { type: "number" } },
          },
          { id: "norm", label: "Norm", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = vectorThreePointAffineDependenceResidualTool.execute;
export default vectorThreePointAffineDependenceResidualTool;
