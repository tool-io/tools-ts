import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly steradians: number };
export type Output = { readonly skyFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { steradians: { type: "number", minimum: 0 } },
  required: ["steradians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { skyFraction: { type: "number" } },
  required: ["skyFraction"],
} as const;
/** Calculate survey solid angle fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { steradians } = request;
  const compute = (): Output => {
    H.domain(steradians >= 0 && steradians <= 4 * Math.PI);
    return { skyFraction: steradians / (4 * Math.PI) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { steradians: 3.141592653589793 },
  output: { skyFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const surveySolidAngleFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/survey-solid-angle-fraction",
    title: "Survey Solid Angle Fraction Tool",
    description:
      "Calculate survey solid angle fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { steradians: { type: "number", minimum: 0 } },
      required: ["steradians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { skyFraction: { type: "number" } },
      required: ["skyFraction"],
    },
    ports: {
      inputs: [
        {
          id: "steradians",
          label: "Steradians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "skyFraction",
          label: "Sky Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveySolidAngleFractionTool.execute;
export default surveySolidAngleFractionTool;
