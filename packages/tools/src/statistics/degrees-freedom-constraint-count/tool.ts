import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationCount: number;
  readonly independentConstraintCount: number;
};
export type Output = { readonly degreesOfFreedom: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationCount: { type: "integer", minimum: 0 },
    independentConstraintCount: { type: "integer", minimum: 0 },
  },
  required: ["observationCount", "independentConstraintCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degreesOfFreedom: { type: "integer" } },
  required: ["degreesOfFreedom"],
} as const;
/** Subtract a caller-supplied count of independent linear constraints from the observation dimension; independence is assumed, not tested. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationCount, independentConstraintCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(observationCount) &&
        observationCount >= 0 &&
        observationCount <= Number.MAX_SAFE_INTEGER,
      "observationCount",
    ),
      observationCount);
    (H.domain(
      Number.isSafeInteger(independentConstraintCount) &&
        independentConstraintCount >= 0 &&
        independentConstraintCount <= observationCount,
      "independentConstraintCount",
    ),
      independentConstraintCount);
    return { degreesOfFreedom: observationCount - independentConstraintCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationCount: 20, independentConstraintCount: 2 },
  output: { degreesOfFreedom: 18 },
} satisfies ToolExample<Input, Output>;
export const degreesFreedomConstraintCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/degrees-freedom-constraint-count",
    title: "Degrees Freedom Constraint Count Tool",
    description:
      "Subtract a caller-supplied count of independent linear constraints from the observation dimension; independence is assumed, not tested.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationCount: { type: "integer", minimum: 0 },
        independentConstraintCount: { type: "integer", minimum: 0 },
      },
      required: ["observationCount", "independentConstraintCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { degreesOfFreedom: { type: "integer" } },
      required: ["degreesOfFreedom"],
    },
    ports: {
      inputs: [
        {
          id: "observationCount",
          label: "Observation Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "independentConstraintCount",
          label: "Independent Constraint Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "degreesOfFreedom",
          label: "Degrees Of Freedom",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = degreesFreedomConstraintCountTool.execute;
export default degreesFreedomConstraintCountTool;
