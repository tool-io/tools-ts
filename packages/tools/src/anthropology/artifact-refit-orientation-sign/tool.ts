import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOrientation: number;
  readonly secondOrientation: number;
  readonly reversedJoin: boolean;
};
export type Output = { readonly relativeOrientation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOrientation: { type: "integer" },
    secondOrientation: { type: "integer" },
    reversedJoin: { type: "boolean" },
  },
  required: ["firstOrientation", "secondOrientation", "reversedJoin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeOrientation: { type: "integer" } },
  required: ["relativeOrientation"],
} as const;
/** Calculate artifact refit orientation sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOrientation, secondOrientation, reversedJoin } = request;
  const compute = (): Output => {
    H.domain(
      [1, -1].includes(firstOrientation) && [1, -1].includes(secondOrientation),
    );
    return {
      relativeOrientation:
        firstOrientation * secondOrientation * (reversedJoin ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOrientation: 1, secondOrientation: -1, reversedJoin: true },
  output: { relativeOrientation: 1 },
} satisfies ToolExample<Input, Output>;
export const artifactRefitOrientationSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/artifact-refit-orientation-sign",
    title: "Artifact Refit Orientation Sign Tool",
    description:
      "Calculate artifact refit orientation sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOrientation: { type: "integer" },
        secondOrientation: { type: "integer" },
        reversedJoin: { type: "boolean" },
      },
      required: ["firstOrientation", "secondOrientation", "reversedJoin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeOrientation: { type: "integer" } },
      required: ["relativeOrientation"],
    },
    ports: {
      inputs: [
        {
          id: "firstOrientation",
          label: "First Orientation",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondOrientation",
          label: "Second Orientation",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reversedJoin",
          label: "Reversed Join",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "relativeOrientation",
          label: "Relative Orientation",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = artifactRefitOrientationSignTool.execute;
export default artifactRefitOrientationSignTool;
