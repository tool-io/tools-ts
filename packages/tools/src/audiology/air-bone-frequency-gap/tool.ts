import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly airThresholdDb: number;
  readonly boneThresholdDb: number;
  readonly frequencyHz: number;
};
export type Output = { readonly airMinusBoneDb: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    airThresholdDb: { type: "number" },
    boneThresholdDb: { type: "number" },
    frequencyHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["airThresholdDb", "boneThresholdDb", "frequencyHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { airMinusBoneDb: { type: "number" } },
  required: ["airMinusBoneDb"],
} as const;
/** Subtract matched-frequency bone-conduction threshold from air-conduction threshold on the same dB reference scale without a diagnostic interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { airThresholdDb, boneThresholdDb, frequencyHz } = request;
  const compute = (): Output => {
    (H.domain(frequencyHz > 0, "frequencyHz"), frequencyHz);
    return { airMinusBoneDb: airThresholdDb - boneThresholdDb };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { airThresholdDb: 35, boneThresholdDb: 15, frequencyHz: 1000 },
  output: { airMinusBoneDb: 20 },
} satisfies ToolExample<Input, Output>;
export const airBoneFrequencyGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["audiology", "health and medicine"],
        keywords: ["audiology", "health and medicine"],
      },
      id: "audiology/air-bone-frequency-gap",
      title: "Air Bone Frequency Gap",
      description:
        "Subtract matched-frequency bone-conduction threshold from air-conduction threshold on the same dB reference scale without a diagnostic interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          airThresholdDb: { type: "number" },
          boneThresholdDb: { type: "number" },
          frequencyHz: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["airThresholdDb", "boneThresholdDb", "frequencyHz"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { airMinusBoneDb: { type: "number" } },
        required: ["airMinusBoneDb"],
      },
      ports: {
        inputs: [
          {
            id: "airThresholdDb",
            label: "Air Threshold Db",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "boneThresholdDb",
            label: "Bone Threshold Db",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "frequencyHz",
            label: "Frequency Hz",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "airMinusBoneDb",
            label: "Air Minus Bone Db",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = airBoneFrequencyGapTool.execute;
export default airBoneFrequencyGapTool;
