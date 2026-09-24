import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly massRate: number;
  readonly referenceDuration: number;
};
export type Output = { readonly duration: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    massRate: { type: "number", exclusiveMinimum: 0 },
    referenceDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "massRate", "referenceDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { duration: { type: "number" }, factor: { type: "number" } },
  required: ["duration", "factor"],
} as const;
/** Compare an ideal constant-rate boiloff duration to a supplied reference; no vessel safety model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, massRate, referenceDuration } = request;
  const compute = (): Output => {
    H.domain(mass >= 0);
    H.positive(massRate);
    H.positive(referenceDuration);
    return {
      duration: mass / massRate,
      factor: mass / massRate / referenceDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 10, massRate: 2, referenceDuration: 10 },
  output: { duration: 5, factor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const boiloffDurationReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/boiloff-duration-reference-factor",
    title: "Boiloff Duration Reference Factor Tool",
    description:
      "Compare an ideal constant-rate boiloff duration to a supplied reference; no vessel safety model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        massRate: { type: "number", exclusiveMinimum: 0 },
        referenceDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mass", "massRate", "referenceDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { duration: { type: "number" }, factor: { type: "number" } },
      required: ["duration", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "massRate",
          label: "Mass Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDuration",
          label: "Reference Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "duration", label: "Duration", valueType: { type: "number" } },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = boiloffDurationReferenceFactorTool.execute;
export default boiloffDurationReferenceFactorTool;
