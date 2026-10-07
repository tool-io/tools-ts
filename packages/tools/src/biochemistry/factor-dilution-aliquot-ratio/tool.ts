import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly aliquotVolume: number;
  readonly finalVolume: number;
};
export type Output = {
  readonly dilutionFactor: number;
  readonly aliquotFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aliquotVolume: { type: "number", exclusiveMinimum: 0 },
    finalVolume: { type: "number" },
  },
  required: ["aliquotVolume", "finalVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dilutionFactor: { type: "number" },
    aliquotFraction: { type: "number" },
  },
  required: ["dilutionFactor", "aliquotFraction"],
} as const;
/** Describe a recorded aliquot dilution using compatible volumes and a final volume that includes the aliquot. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { aliquotVolume, finalVolume } = request;
  const compute = (): Output => {
    (H.domain(aliquotVolume > 0, "aliquotVolume"), aliquotVolume);
    H.domain(finalVolume >= aliquotVolume, "finalVolume");
    return {
      dilutionFactor: finalVolume / aliquotVolume,
      aliquotFraction: aliquotVolume / finalVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { aliquotVolume: 2, finalVolume: 10 },
  output: { dilutionFactor: 5, aliquotFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const factorDilutionAliquotRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/factor-dilution-aliquot-ratio",
    title: "Factor Dilution Aliquot Ratio",
    description:
      "Describe a recorded aliquot dilution using compatible volumes and a final volume that includes the aliquot.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        aliquotVolume: { type: "number", exclusiveMinimum: 0 },
        finalVolume: { type: "number" },
      },
      required: ["aliquotVolume", "finalVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dilutionFactor: { type: "number" },
        aliquotFraction: { type: "number" },
      },
      required: ["dilutionFactor", "aliquotFraction"],
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
      ],
      outputs: [
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          valueType: { type: "number" },
        },
        {
          id: "aliquotFraction",
          label: "Aliquot Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = factorDilutionAliquotRatioTool.execute;
export default factorDilutionAliquotRatioTool;
