import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly normal: readonly number[];
};
export type Output = {
  readonly coefficient: number;
  readonly reversedCoefficient: number;
  readonly projected: readonly number[];
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
    coefficient: { type: "number" },
    reversedCoefficient: { type: "number" },
    projected: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["coefficient", "reversedCoefficient", "projected"],
} as const;
/** Normal reversal flips the scalar coefficient but preserves the projected vector. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vector, normal } = request;
  const compute = (): Output => {
    H.sameLength(vector, normal);
    H.domain(normal.some((x) => x !== 0));
    return {
      coefficient: H.dot(vector, normal) / H.dot(normal, normal),
      reversedCoefficient: -H.dot(vector, normal) / H.dot(normal, normal),
      projected: normal.map(
        (x) => (x * H.dot(vector, normal)) / H.dot(normal, normal),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vector: [3, 4], normal: [0, 2] },
  output: { coefficient: 2, reversedCoefficient: -2, projected: [0, 4] },
} satisfies ToolExample<Input, Output>;
export const vectorNormalProjectionSignFlipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-normal-projection-sign-flip",
    title: "Vector Normal Projection Sign Flip Tool",
    description:
      "Normal reversal flips the scalar coefficient but preserves the projected vector.",
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
        coefficient: { type: "number" },
        reversedCoefficient: { type: "number" },
        projected: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["coefficient", "reversedCoefficient", "projected"],
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
          id: "coefficient",
          label: "Coefficient",
          valueType: { type: "number" },
        },
        {
          id: "reversedCoefficient",
          label: "Reversed Coefficient",
          valueType: { type: "number" },
        },
        {
          id: "projected",
          label: "Projected",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorNormalProjectionSignFlipTool.execute;
export default vectorNormalProjectionSignFlipTool;
