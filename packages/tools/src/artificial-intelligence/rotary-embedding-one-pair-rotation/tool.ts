import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly angleRadians: number;
};
export type Output = {
  readonly firstRotated: number;
  readonly secondRotated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    angleRadians: { type: "number" },
  },
  required: ["first", "second", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRotated: { type: "number" },
    secondRotated: { type: "number" },
  },
  required: ["firstRotated", "secondRotated"],
} as const;
/** Rotate one explicit coordinate pair; the caller supplies the RoPE position/frequency angle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, angleRadians } = request;
  const compute = (): Output => {
    return {
      firstRotated:
        first * Math.cos(angleRadians) - second * Math.sin(angleRadians),
      secondRotated:
        first * Math.sin(angleRadians) + second * Math.cos(angleRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 3, second: 4, angleRadians: 0 },
  output: { firstRotated: 3, secondRotated: 4 },
} satisfies ToolExample<Input, Output>;
export const rotaryEmbeddingOnePairRotationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/rotary-embedding-one-pair-rotation",
    title: "Rotary Embedding One Pair Rotation Tool",
    description:
      "Rotate one explicit coordinate pair; the caller supplies the RoPE position/frequency angle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        angleRadians: { type: "number" },
      },
      required: ["first", "second", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRotated: { type: "number" },
        secondRotated: { type: "number" },
      },
      required: ["firstRotated", "secondRotated"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "firstRotated",
          label: "First Rotated",
          valueType: { type: "number" },
        },
        {
          id: "secondRotated",
          label: "Second Rotated",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rotaryEmbeddingOnePairRotationTool.execute;
export default rotaryEmbeddingOnePairRotationTool;
