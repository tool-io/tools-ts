import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly blank: number;
  readonly sampleVolume: number;
  readonly diluentVolume: number;
  readonly additionalDilution: number;
};
export type Output = {
  readonly dilutionFactor: number;
  readonly originalConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    blank: { type: "number" },
    sampleVolume: { type: "number", exclusiveMinimum: 0 },
    diluentVolume: { type: "number", minimum: 0 },
    additionalDilution: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "measured",
    "blank",
    "sampleVolume",
    "diluentVolume",
    "additionalDilution",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dilutionFactor: { type: "number" },
    originalConcentration: { type: "number" },
  },
  required: ["dilutionFactor", "originalConcentration"],
} as const;
/** Explicit additive-volume dilution back-calculation preserving signed blank correction, without an assay or laboratory procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, blank, sampleVolume, diluentVolume, additionalDilution } =
    request;
  const compute = (): Output => {
    H.positive(sampleVolume);
    H.domain(diluentVolume >= 0);
    H.positive(additionalDilution);
    return {
      dilutionFactor:
        ((sampleVolume + diluentVolume) * additionalDilution) / sampleVolume,
      originalConcentration:
        ((measured - blank) *
          (sampleVolume + diluentVolume) *
          additionalDilution) /
        sampleVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measured: 12,
    blank: 2,
    sampleVolume: 1,
    diluentVolume: 4,
    additionalDilution: 2,
  },
  output: { dilutionFactor: 10, originalConcentration: 100 },
} satisfies ToolExample<Input, Output>;
export const renalSampleConcentrationDilutionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nephrology/renal-sample-concentration-dilution-term",
      title: "Renal Sample Concentration Dilution Term Tool",
      description:
        "Explicit additive-volume dilution back-calculation preserving signed blank correction, without an assay or laboratory procedure.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measured: { type: "number" },
          blank: { type: "number" },
          sampleVolume: { type: "number", exclusiveMinimum: 0 },
          diluentVolume: { type: "number", minimum: 0 },
          additionalDilution: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "measured",
          "blank",
          "sampleVolume",
          "diluentVolume",
          "additionalDilution",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dilutionFactor: { type: "number" },
          originalConcentration: { type: "number" },
        },
        required: ["dilutionFactor", "originalConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "measured",
            label: "Measured",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blank",
            label: "Blank",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleVolume",
            label: "Sample Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "diluentVolume",
            label: "Diluent Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "additionalDilution",
            label: "Additional Dilution",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "dilutionFactor",
            label: "Dilution Factor",
            valueType: { type: "number" },
          },
          {
            id: "originalConcentration",
            label: "Original Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = renalSampleConcentrationDilutionTermTool.execute;
export default renalSampleConcentrationDilutionTermTool;
