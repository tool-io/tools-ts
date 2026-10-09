import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedField: number;
  readonly referenceStartField: number;
  readonly referenceEndField: number;
  readonly interpolationFraction: number;
};
export type Output = {
  readonly referenceField: number;
  readonly correctedField: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedField: { type: "number" },
    referenceStartField: { type: "number" },
    referenceEndField: { type: "number" },
    interpolationFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "observedField",
    "referenceStartField",
    "referenceEndField",
    "interpolationFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceField: { type: "number" },
    correctedField: { type: "number" },
  },
  required: ["referenceField", "correctedField"],
} as const;
/** Subtract an explicitly linearly interpolated magnetometer reference field from a supplied observation without estimating secular or spatial corrections. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observedField,
    referenceStartField,
    referenceEndField,
    interpolationFraction,
  } = request;
  const compute = (): Output => {
    (H.domain(
      interpolationFraction >= 0 && interpolationFraction <= 1,
      "interpolationFraction",
    ),
      interpolationFraction);
    return (() => {
      const referenceField =
        (1 - interpolationFraction) * referenceStartField +
        interpolationFraction * referenceEndField;
      return { referenceField, correctedField: observedField - referenceField };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedField: 50,
    referenceStartField: 10,
    referenceEndField: 20,
    interpolationFraction: 0.25,
  },
  output: { referenceField: 12.5, correctedField: 37.5 },
} satisfies ToolExample<Input, Output>;
export const magnetometerDiurnalLinearReferenceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/magnetometer-diurnal-linear-reference-term",
      title: "Magnetometer Diurnal Linear Reference Term Tool",
      description:
        "Subtract an explicitly linearly interpolated magnetometer reference field from a supplied observation without estimating secular or spatial corrections.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedField: { type: "number" },
          referenceStartField: { type: "number" },
          referenceEndField: { type: "number" },
          interpolationFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "observedField",
          "referenceStartField",
          "referenceEndField",
          "interpolationFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceField: { type: "number" },
          correctedField: { type: "number" },
        },
        required: ["referenceField", "correctedField"],
      },
      ports: {
        inputs: [
          {
            id: "observedField",
            label: "Observed Field",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceStartField",
            label: "Reference Start Field",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceEndField",
            label: "Reference End Field",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interpolationFraction",
            label: "Interpolation Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "referenceField",
            label: "Reference Field",
            valueType: { type: "number" },
          },
          {
            id: "correctedField",
            label: "Corrected Field",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = magnetometerDiurnalLinearReferenceTermTool.execute;
export default magnetometerDiurnalLinearReferenceTermTool;
