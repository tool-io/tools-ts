import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
  dot,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly vector: readonly number[];
  readonly normal: readonly number[];
};
export type Output = {
  readonly normalComponent: readonly number[];
  readonly tangentComponent: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["vector", "normal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalComponent: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    tangentComponent: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["normalComponent", "tangentComponent"],
} as const;
/** Compute vector normal tangent component pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { vector, normal } = input;
  const compute = (): Output => {
    sameLength(vector, normal);
    domain(vector.length > 0 && Math.abs(dot(normal, normal) - 1) <= 1e-12);
    const q = dot(vector, normal),
      normalComponent = normal.map((x) => x * q);
    return {
      normalComponent,
      tangentComponent: vector.map((x, i) => x - normalComponent[i]),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vector: [3, 4], normal: [1, 0] },
  output: { normalComponent: [3, 0], tangentComponent: [0, 4] },
} satisfies ToolExample<Input, Output>;
export const vectorNormalTangentComponentPairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "vector/vector-normal-tangent-component-pair",
  title: "Vector Normal Tangent Component Pair Tool",
  description:
    "Compute vector normal tangent component pair from explicit bounded inputs.",
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
        id: "normal",
        label: "Normal",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
    outputs: [
      {
        id: "normalComponent",
        label: "Normal Component",
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "tangentComponent",
        label: "Tangent Component",
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
  },
});
export const run = vectorNormalTangentComponentPairTool.execute;
export default vectorNormalTangentComponentPairTool;
