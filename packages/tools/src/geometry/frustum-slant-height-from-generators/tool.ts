import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly firstRadius: number;
  readonly secondRadius: number;
};
export type Output = { readonly slantHeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number", minimum: 0 },
    firstRadius: { type: "number", minimum: 0 },
    secondRadius: { type: "number", minimum: 0 },
  },
  required: ["height", "firstRadius", "secondRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slantHeight: { type: "number" } },
  required: ["slantHeight"],
} as const;
/** Calculate frustum slant height from generators from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { height, firstRadius, secondRadius } = input;
  const compute = (): Output => {
    H.domain(height >= 0 && firstRadius >= 0 && secondRadius >= 0);
    return { slantHeight: Math.hypot(height, firstRadius - secondRadius) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { height: 4, firstRadius: 5, secondRadius: 2 },
  output: { slantHeight: 5 },
} satisfies ToolExample<Input, Output>;
export const frustumSlantHeightFromGeneratorsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/frustum-slant-height-from-generators",
    title: "Frustum Slant Height From Generators Tool",
    description:
      "Calculate frustum slant height from generators from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        height: { type: "number", minimum: 0 },
        firstRadius: { type: "number", minimum: 0 },
        secondRadius: { type: "number", minimum: 0 },
      },
      required: ["height", "firstRadius", "secondRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slantHeight: { type: "number" } },
      required: ["slantHeight"],
    },
    ports: {
      inputs: [
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRadius",
          label: "First Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRadius",
          label: "Second Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "slantHeight",
          label: "Slant Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = frustumSlantHeightFromGeneratorsTool.execute;
export default frustumSlantHeightFromGeneratorsTool;
