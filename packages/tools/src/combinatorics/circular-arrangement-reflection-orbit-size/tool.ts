import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rotations: number;
  readonly reflectionSymmetric: boolean;
};
export type Output = { readonly orbit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rotations: { type: "integer", minimum: 1, maximum: 1000000 },
    reflectionSymmetric: { type: "boolean" },
  },
  required: ["rotations", "reflectionSymmetric"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { orbit: { type: "integer" } },
  required: ["orbit"],
} as const;
/** Calculate circular arrangement reflection orbit size from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { rotations, reflectionSymmetric } = input;
  const compute = (): Output => {
    H.integer(rotations, 1, 1000000);
    return { orbit: rotations * (reflectionSymmetric ? 1 : 2) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { rotations: 5, reflectionSymmetric: false },
  output: { orbit: 10 },
} satisfies ToolExample<Input, Output>;
export const circularArrangementReflectionOrbitSizeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "combinatorics/circular-arrangement-reflection-orbit-size",
      title: "Circular Arrangement Reflection Orbit Size Tool",
      description:
        "Calculate circular arrangement reflection orbit size from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rotations: { type: "integer", minimum: 1, maximum: 1000000 },
          reflectionSymmetric: { type: "boolean" },
        },
        required: ["rotations", "reflectionSymmetric"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { orbit: { type: "integer" } },
        required: ["orbit"],
      },
      ports: {
        inputs: [
          {
            id: "rotations",
            label: "Rotations",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reflectionSymmetric",
            label: "Reflection Symmetric",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "orbit", label: "Orbit", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = circularArrangementReflectionOrbitSizeTool.execute;
export default circularArrangementReflectionOrbitSizeTool;
