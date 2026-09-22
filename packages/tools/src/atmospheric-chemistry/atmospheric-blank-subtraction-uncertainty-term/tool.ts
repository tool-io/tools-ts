import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleAmount: number;
  readonly blankAmount: number;
  readonly sampleVolume: number;
  readonly blankEquivalentVolume: number;
  readonly sampleUncertainty: number;
  readonly blankUncertainty: number;
};
export type Output = {
  readonly correctedConcentration: number;
  readonly combinedUncertainty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleAmount: { type: "number" },
    blankAmount: { type: "number" },
    sampleVolume: { type: "number", exclusiveMinimum: 0 },
    blankEquivalentVolume: { type: "number", exclusiveMinimum: 0 },
    sampleUncertainty: { type: "number", minimum: 0 },
    blankUncertainty: { type: "number", minimum: 0 },
  },
  required: [
    "sampleAmount",
    "blankAmount",
    "sampleVolume",
    "blankEquivalentVolume",
    "sampleUncertainty",
    "blankUncertainty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedConcentration: { type: "number" },
    combinedUncertainty: { type: "number" },
  },
  required: ["correctedConcentration", "combinedUncertainty"],
} as const;
/** Independent sample and blank amount uncertainties, each divided by its explicit equivalent air volume; covariance is excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleAmount,
    blankAmount,
    sampleVolume,
    blankEquivalentVolume,
    sampleUncertainty,
    blankUncertainty,
  } = request;
  const compute = (): Output => {
    H.positive(sampleVolume);
    H.positive(blankEquivalentVolume);
    H.domain(sampleUncertainty >= 0 && blankUncertainty >= 0);
    return {
      correctedConcentration:
        sampleAmount / sampleVolume - blankAmount / blankEquivalentVolume,
      combinedUncertainty: Math.hypot(
        sampleUncertainty / sampleVolume,
        blankUncertainty / blankEquivalentVolume,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleAmount: 10,
    blankAmount: 2,
    sampleVolume: 2,
    blankEquivalentVolume: 2,
    sampleUncertainty: 0.6,
    blankUncertainty: 0.8,
  },
  output: { correctedConcentration: 4, combinedUncertainty: 0.5 },
} satisfies ToolExample<Input, Output>;
export const atmosphericBlankSubtractionUncertaintyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/atmospheric-blank-subtraction-uncertainty-term",
      title: "Atmospheric Blank Subtraction Uncertainty Term Tool",
      description:
        "Independent sample and blank amount uncertainties, each divided by its explicit equivalent air volume; covariance is excluded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleAmount: { type: "number" },
          blankAmount: { type: "number" },
          sampleVolume: { type: "number", exclusiveMinimum: 0 },
          blankEquivalentVolume: { type: "number", exclusiveMinimum: 0 },
          sampleUncertainty: { type: "number", minimum: 0 },
          blankUncertainty: { type: "number", minimum: 0 },
        },
        required: [
          "sampleAmount",
          "blankAmount",
          "sampleVolume",
          "blankEquivalentVolume",
          "sampleUncertainty",
          "blankUncertainty",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedConcentration: { type: "number" },
          combinedUncertainty: { type: "number" },
        },
        required: ["correctedConcentration", "combinedUncertainty"],
      },
      ports: {
        inputs: [
          {
            id: "sampleAmount",
            label: "Sample Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankAmount",
            label: "Blank Amount",
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
            id: "blankEquivalentVolume",
            label: "Blank Equivalent Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleUncertainty",
            label: "Sample Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankUncertainty",
            label: "Blank Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedConcentration",
            label: "Corrected Concentration",
            valueType: { type: "number" },
          },
          {
            id: "combinedUncertainty",
            label: "Combined Uncertainty",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = atmosphericBlankSubtractionUncertaintyTermTool.execute;
export default atmosphericBlankSubtractionUncertaintyTermTool;
