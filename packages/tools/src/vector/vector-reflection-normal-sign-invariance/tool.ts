import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly normal: readonly number[];
};
export type Output = {
  readonly reflected: readonly number[];
  readonly reversedNormalResult: readonly number[];
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
    reflected: { type: "array", maxItems: 256, items: { type: "number" } },
    reversedNormalResult: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["reflected", "reversedNormalResult"],
} as const;
/** Calculate vector reflection normal sign invariance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { vector, normal } = input;
  const compute = (): Output => {
    H.sameLength(vector, normal);
    const norm = H.dot(normal, normal);
    H.positive(norm);
    const factor = (2 * H.dot(vector, normal)) / norm,
      reflected = vector.map((x, i) => x - factor * normal[i]);
    return { reflected, reversedNormalResult: reflected };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vector: [2, 3], normal: [1, 0] },
  output: { reflected: [-2, 3], reversedNormalResult: [-2, 3] },
} satisfies ToolExample<Input, Output>;
export const vectorReflectionNormalSignInvarianceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-reflection-normal-sign-invariance",
      title: "Vector Reflection Normal Sign Invariance Tool",
      description:
        "Calculate vector reflection normal sign invariance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vector: { type: "array", maxItems: 256, items: { type: "number" } },
          normal: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["vector", "normal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reflected: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          reversedNormalResult: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["reflected", "reversedNormalResult"],
      },
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
            id: "reflected",
            label: "Reflected",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "reversedNormalResult",
            label: "Reversed Normal Result",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorReflectionNormalSignInvarianceTool.execute;
export default vectorReflectionNormalSignInvarianceTool;
