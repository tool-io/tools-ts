import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delta33: number;
  readonly delta34: number;
  readonly exponent: number;
};
export type Output = {
  readonly predictedDelta33: number;
  readonly capitalDelta33: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delta33: { type: "number", minimum: -1000 },
    delta34: { type: "number", exclusiveMinimum: -1000 },
    exponent: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["delta33", "delta34", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedDelta33: { type: "number" },
    capitalDelta33: { type: "number" },
  },
  required: ["predictedDelta33", "capitalDelta33"],
} as const;
/** Nonlinear capital-delta anomaly relative to an explicitly supplied mass-dependent exponent; deltas are per mil. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delta33, delta34, exponent } = request;
  const compute = (): Output => {
    H.domain(delta33 >= -1000 && delta34 > -1000);
    H.positive(exponent);
    return {
      predictedDelta33:
        1000 * Math.expm1(exponent * Math.log1p(delta34 / 1000)),
      capitalDelta33:
        delta33 - 1000 * Math.expm1(exponent * Math.log1p(delta34 / 1000)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delta33: 5, delta34: 10, exponent: 0.5 },
  output: {
    predictedDelta33: 4.987562112089027,
    capitalDelta33: 0.012437887910972556,
  },
} satisfies ToolExample<Input, Output>;
export const sulfurIsotopeMassDependentOffsetTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/sulfur-isotope-mass-dependent-offset-term",
      title: "Sulfur Isotope Mass Dependent Offset Term Tool",
      description:
        "Nonlinear capital-delta anomaly relative to an explicitly supplied mass-dependent exponent; deltas are per mil.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          delta33: { type: "number", minimum: -1000 },
          delta34: { type: "number", exclusiveMinimum: -1000 },
          exponent: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["delta33", "delta34", "exponent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predictedDelta33: { type: "number" },
          capitalDelta33: { type: "number" },
        },
        required: ["predictedDelta33", "capitalDelta33"],
      },
      ports: {
        inputs: [
          {
            id: "delta33",
            label: "Delta33",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "delta34",
            label: "Delta34",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exponent",
            label: "Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "predictedDelta33",
            label: "Predicted Delta33",
            valueType: { type: "number" },
          },
          {
            id: "capitalDelta33",
            label: "Capital Delta33",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sulfurIsotopeMassDependentOffsetTermTool.execute;
export default sulfurIsotopeMassDependentOffsetTermTool;
