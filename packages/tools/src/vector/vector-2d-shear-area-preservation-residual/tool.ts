import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly shear: number;
};
export type Output = {
  readonly before: number;
  readonly after: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    shear: { type: "number" },
  },
  required: ["first", "second", "shear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "number" },
    after: { type: "number" },
    residual: { type: "number" },
  },
  required: ["before", "after", "residual"],
} as const;
/** Calculate vector 2d shear area preservation residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, shear } = request;
  const compute = (): Output => {
    H.domain(first.length === 2 && second.length === 2);
    const before = first[0] * second[1] - first[1] * second[0],
      after =
        (first[0] + shear * first[1]) * second[1] -
        first[1] * (second[0] + shear * second[1]);
    return { before, after, residual: after - before };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [2, 3], second: [4, 5], shear: 2 },
  output: { before: -2, after: -2, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const vector2dShearAreaPreservationResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-2d-shear-area-preservation-residual",
      title: "Vector 2d Shear Area Preservation Residual Tool",
      description:
        "Calculate vector 2d shear area preservation residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "array", maxItems: 256, items: { type: "number" } },
          second: { type: "array", maxItems: 256, items: { type: "number" } },
          shear: { type: "number" },
        },
        required: ["first", "second", "shear"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          before: { type: "number" },
          after: { type: "number" },
          residual: { type: "number" },
        },
        required: ["before", "after", "residual"],
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
            id: "shear",
            label: "Shear",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "before", label: "Before", valueType: { type: "number" } },
          { id: "after", label: "After", valueType: { type: "number" } },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = vector2dShearAreaPreservationResidualTool.execute;
export default vector2dShearAreaPreservationResidualTool;
