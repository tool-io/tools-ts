import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  mod,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly vector: readonly number[];
  readonly axis: string;
  readonly turns: number;
};
export type Output = { readonly vector: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    axis: { type: "string", maxLength: 8192, enum: ["x", "y", "z"] },
    turns: { type: "integer", minimum: -1000000, maximum: 1000000 },
  },
  required: ["vector", "axis", "turns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["vector"],
} as const;
/** Compute vector fixed axis rotation quarter turn from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { vector, axis, turns } = input;
  const compute = (): Output => {
    domain(vector.length === 3 && ["x", "y", "z"].includes(axis));
    integer(turns, -1000000, 1000000);
    let [x, y, z] = vector;
    for (let i = 0; i < mod(turns, 4); i++) {
      if (axis === "x") [y, z] = [-z, y];
      else if (axis === "y") [x, z] = [z, -x];
      else [x, y] = [-y, x];
    }
    return { vector: [x, y, z].map((v) => (v === 0 ? 0 : v)) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vector: [1, 2, 3], axis: "z", turns: 1 },
  output: { vector: [-2, 1, 3] },
} satisfies ToolExample<Input, Output>;
export const vectorFixedAxisRotationQuarterTurnTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "vector/vector-fixed-axis-rotation-quarter-turn",
  title: "Vector Fixed Axis Rotation Quarter Turn Tool",
  description:
    "Compute vector fixed axis rotation quarter turn from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "vector",
        label: "Vector",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "axis",
        label: "Axis",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "turns",
        label: "Turns",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "vector",
        label: "Vector",
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
  },
});
export const run = vectorFixedAxisRotationQuarterTurnTool.execute;
export default vectorFixedAxisRotationQuarterTurnTool;
