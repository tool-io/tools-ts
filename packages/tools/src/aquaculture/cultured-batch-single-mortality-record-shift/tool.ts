import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedLive: number;
  readonly correctedMortality: number;
  readonly previousMortality: number;
};
export type Output = { readonly correctedLive: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedLive: { type: "integer", minimum: 0 },
    correctedMortality: { type: "integer", minimum: 0 },
    previousMortality: { type: "integer", minimum: 0 },
  },
  required: ["recordedLive", "correctedMortality", "previousMortality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedLive: { type: "integer" } },
  required: ["correctedLive"],
} as const;
/** Revise one cultured-batch live-count record by replacing the previous mortality count with an explicit corrected count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedLive, correctedMortality, previousMortality } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(recordedLive) &&
        recordedLive >= 0 &&
        recordedLive <= Number.MAX_SAFE_INTEGER,
      "recordedLive",
    ),
      recordedLive);
    (H.domain(
      Number.isSafeInteger(correctedMortality) &&
        correctedMortality >= 0 &&
        correctedMortality <= Number.MAX_SAFE_INTEGER,
      "correctedMortality",
    ),
      correctedMortality);
    (H.domain(
      Number.isSafeInteger(previousMortality) &&
        previousMortality >= 0 &&
        previousMortality <= Number.MAX_SAFE_INTEGER,
      "previousMortality",
    ),
      previousMortality);
    return {
      correctedLive: Number(
        BigInt(recordedLive) +
          BigInt(previousMortality) -
          BigInt(correctedMortality),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedLive: 100, correctedMortality: 5, previousMortality: 3 },
  output: { correctedLive: 98 },
} satisfies ToolExample<Input, Output>;
export const culturedBatchSingleMortalityRecordShiftTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["aquaculture", "agriculture"],
        keywords: ["aquaculture", "agriculture"],
      },
      id: "aquaculture/cultured-batch-single-mortality-record-shift",
      title: "Cultured Batch Single Mortality Record Shift",
      description:
        "Revise one cultured-batch live-count record by replacing the previous mortality count with an explicit corrected count.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedLive: { type: "integer", minimum: 0 },
          correctedMortality: { type: "integer", minimum: 0 },
          previousMortality: { type: "integer", minimum: 0 },
        },
        required: ["recordedLive", "correctedMortality", "previousMortality"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { correctedLive: { type: "integer" } },
        required: ["correctedLive"],
      },
      ports: {
        inputs: [
          {
            id: "recordedLive",
            label: "Recorded Live",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "correctedMortality",
            label: "Corrected Mortality",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "previousMortality",
            label: "Previous Mortality",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "correctedLive",
            label: "Corrected Live",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = culturedBatchSingleMortalityRecordShiftTool.execute;
export default culturedBatchSingleMortalityRecordShiftTool;
