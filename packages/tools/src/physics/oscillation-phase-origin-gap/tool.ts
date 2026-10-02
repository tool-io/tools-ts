import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angularFrequency: number;
  readonly firstOrigin: number;
  readonly secondOrigin: number;
};
export type Output = { readonly phaseGapRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularFrequency: { type: "number" },
    firstOrigin: { type: "number" },
    secondOrigin: { type: "number" },
  },
  required: ["angularFrequency", "firstOrigin", "secondOrigin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseGapRadians: { type: "number" } },
  required: ["phaseGapRadians"],
} as const;
/** Report the unwrapped phase offset induced by shifting the supplied time origin; no frequency is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularFrequency, firstOrigin, secondOrigin } = request;
  const compute = (): Output => {
    return { phaseGapRadians: angularFrequency * (secondOrigin - firstOrigin) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angularFrequency: 2, firstOrigin: 3, secondOrigin: 5 },
  output: { phaseGapRadians: 4 },
} satisfies ToolExample<Input, Output>;
export const oscillationPhaseOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/oscillation-phase-origin-gap",
    title: "Oscillation Phase Origin Gap Tool",
    description:
      "Report the unwrapped phase offset induced by shifting the supplied time origin; no frequency is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularFrequency: { type: "number" },
        firstOrigin: { type: "number" },
        secondOrigin: { type: "number" },
      },
      required: ["angularFrequency", "firstOrigin", "secondOrigin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseGapRadians: { type: "number" } },
      required: ["phaseGapRadians"],
    },
    ports: {
      inputs: [
        {
          id: "angularFrequency",
          label: "Angular Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOrigin",
          label: "First Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOrigin",
          label: "Second Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseGapRadians",
          label: "Phase Gap Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oscillationPhaseOriginGapTool.execute;
export default oscillationPhaseOriginGapTool;
