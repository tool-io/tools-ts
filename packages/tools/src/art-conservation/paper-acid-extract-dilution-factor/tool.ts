import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly aliquotVolume: number;
  readonly finalVolume: number;
  readonly measuredConcentration: number;
  readonly blankConcentration: number;
};
export type Output = {
  readonly dilutionFactor: number;
  readonly originalConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aliquotVolume: { type: "number", exclusiveMinimum: 0 },
    finalVolume: { type: "number" },
    measuredConcentration: { type: "number" },
    blankConcentration: { type: "number" },
  },
  required: [
    "aliquotVolume",
    "finalVolume",
    "measuredConcentration",
    "blankConcentration",
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
/** Linear concentration dilution correction; pH values are logarithmic and must not be substituted for concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    aliquotVolume,
    finalVolume,
    measuredConcentration,
    blankConcentration,
  } = request;
  const compute = (): Output => {
    H.positive(aliquotVolume);
    H.domain(finalVolume >= aliquotVolume);
    return {
      dilutionFactor: finalVolume / aliquotVolume,
      originalConcentration:
        ((measuredConcentration - blankConcentration) * finalVolume) /
        aliquotVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    aliquotVolume: 2,
    finalVolume: 10,
    measuredConcentration: 3,
    blankConcentration: 0.5,
  },
  output: { dilutionFactor: 5, originalConcentration: 12.5 },
} satisfies ToolExample<Input, Output>;
export const paperAcidExtractDilutionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/paper-acid-extract-dilution-factor",
    title: "Paper Acid Extract Dilution Factor Tool",
    description:
      "Linear concentration dilution correction; pH values are logarithmic and must not be substituted for concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        aliquotVolume: { type: "number", exclusiveMinimum: 0 },
        finalVolume: { type: "number" },
        measuredConcentration: { type: "number" },
        blankConcentration: { type: "number" },
      },
      required: [
        "aliquotVolume",
        "finalVolume",
        "measuredConcentration",
        "blankConcentration",
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
          id: "aliquotVolume",
          label: "Aliquot Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalVolume",
          label: "Final Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredConcentration",
          label: "Measured Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankConcentration",
          label: "Blank Concentration",
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
export const run = paperAcidExtractDilutionFactorTool.execute;
export default paperAcidExtractDilutionFactorTool;
