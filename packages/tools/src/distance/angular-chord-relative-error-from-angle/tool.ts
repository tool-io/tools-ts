import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly angle: number };
export type Output = { readonly relativeError: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angle: { type: "number", exclusiveMinimum: 0 } },
  required: ["angle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeError: { type: "number" } },
  required: ["relativeError"],
} as const;
/** Calculate angular chord relative error from angle from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { angle } = input;
  const compute = (): Output => {
    H.domain(angle > 0 && angle <= Math.PI);
    return { relativeError: 1 - (2 * Math.sin(angle / 2)) / angle };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { angle: 3.141592653589793 },
  output: { relativeError: 0.3633802276324186 },
} satisfies ToolExample<Input, Output>;
export const angularChordRelativeErrorFromAngleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/angular-chord-relative-error-from-angle",
    title: "Angular Chord Relative Error From Angle Tool",
    description:
      "Calculate angular chord relative error from angle from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angle: { type: "number", exclusiveMinimum: 0 } },
      required: ["angle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeError: { type: "number" } },
      required: ["relativeError"],
    },
    ports: {
      inputs: [
        {
          id: "angle",
          label: "Angle",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeError",
          label: "Relative Error",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = angularChordRelativeErrorFromAngleTool.execute;
export default angularChordRelativeErrorFromAngleTool;
