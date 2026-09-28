import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedVolume: number;
  readonly targetVolume: number;
  readonly citrateVolume: number;
};
export type Output = {
  readonly fillFraction: number;
  readonly bloodCitrateRatio: number;
  readonly targetBloodCitrateRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedVolume: { type: "number", minimum: 0 },
    targetVolume: { type: "number", exclusiveMinimum: 0 },
    citrateVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["collectedVolume", "targetVolume", "citrateVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fillFraction: { type: "number" },
    bloodCitrateRatio: { type: "number" },
    targetBloodCitrateRatio: { type: "number" },
  },
  required: ["fillFraction", "bloodCitrateRatio", "targetBloodCitrateRatio"],
} as const;
/** Volume-ratio audit using supplied blood and citrate amounts; no specimen acceptance limit or clinical correction is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedVolume, targetVolume, citrateVolume } = request;
  const compute = (): Output => {
    H.domain(collectedVolume >= 0);
    H.positive(targetVolume);
    H.positive(citrateVolume);
    return {
      fillFraction: collectedVolume / targetVolume,
      bloodCitrateRatio: collectedVolume / citrateVolume,
      targetBloodCitrateRatio: targetVolume / citrateVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedVolume: 2.4, targetVolume: 2.7, citrateVolume: 0.3 },
  output: {
    fillFraction: 0.8888888888888888,
    bloodCitrateRatio: 8,
    targetBloodCitrateRatio: 9.000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const citrateTubeFillReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/citrate-tube-fill-reference-ratio",
    title: "Citrate Tube Fill Reference Ratio Tool",
    description:
      "Volume-ratio audit using supplied blood and citrate amounts; no specimen acceptance limit or clinical correction is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedVolume: { type: "number", minimum: 0 },
        targetVolume: { type: "number", exclusiveMinimum: 0 },
        citrateVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["collectedVolume", "targetVolume", "citrateVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fillFraction: { type: "number" },
        bloodCitrateRatio: { type: "number" },
        targetBloodCitrateRatio: { type: "number" },
      },
      required: [
        "fillFraction",
        "bloodCitrateRatio",
        "targetBloodCitrateRatio",
      ],
    },
    ports: {
      inputs: [
        {
          id: "collectedVolume",
          label: "Collected Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetVolume",
          label: "Target Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "citrateVolume",
          label: "Citrate Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fillFraction",
          label: "Fill Fraction",
          valueType: { type: "number" },
        },
        {
          id: "bloodCitrateRatio",
          label: "Blood Citrate Ratio",
          valueType: { type: "number" },
        },
        {
          id: "targetBloodCitrateRatio",
          label: "Target Blood Citrate Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = citrateTubeFillReferenceRatioTool.execute;
export default citrateTubeFillReferenceRatioTool;
