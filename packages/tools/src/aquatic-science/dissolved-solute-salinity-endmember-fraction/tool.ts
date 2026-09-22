import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly freshEndmember: number;
  readonly salineEndmember: number;
};
export type Output = {
  readonly salineFraction: number;
  readonly freshFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    freshEndmember: { type: "number" },
    salineEndmember: { type: "number" },
  },
  required: ["observed", "freshEndmember", "salineEndmember"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    salineFraction: { type: "number" },
    freshFraction: { type: "number" },
  },
  required: ["salineFraction", "freshFraction"],
} as const;
/** Unclamped conservative two-endmember fraction; values outside 0..1 reveal observations outside the supplied endpoints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, freshEndmember, salineEndmember } = request;
  const compute = (): Output => {
    H.domain(salineEndmember > freshEndmember);
    return {
      salineFraction:
        (observed - freshEndmember) / (salineEndmember - freshEndmember),
      freshFraction:
        1 - (observed - freshEndmember) / (salineEndmember - freshEndmember),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 10, freshEndmember: 0, salineEndmember: 40 },
  output: { salineFraction: 0.25, freshFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const dissolvedSoluteSalinityEndmemberFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquatic-science/dissolved-solute-salinity-endmember-fraction",
      title: "Dissolved Solute Salinity Endmember Fraction Tool",
      description:
        "Unclamped conservative two-endmember fraction; values outside 0..1 reveal observations outside the supplied endpoints.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number" },
          freshEndmember: { type: "number" },
          salineEndmember: { type: "number" },
        },
        required: ["observed", "freshEndmember", "salineEndmember"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          salineFraction: { type: "number" },
          freshFraction: { type: "number" },
        },
        required: ["salineFraction", "freshFraction"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "freshEndmember",
            label: "Fresh Endmember",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "salineEndmember",
            label: "Saline Endmember",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "salineFraction",
            label: "Saline Fraction",
            valueType: { type: "number" },
          },
          {
            id: "freshFraction",
            label: "Fresh Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dissolvedSoluteSalinityEndmemberFractionTool.execute;
export default dissolvedSoluteSalinityEndmemberFractionTool;
