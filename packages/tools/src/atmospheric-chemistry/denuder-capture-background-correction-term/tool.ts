import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedAmount: number;
  readonly blankAmount: number;
  readonly sampledVolume: number;
  readonly captureFraction: number;
};
export type Output = {
  readonly netAmount: number;
  readonly correctedConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedAmount: { type: "number", minimum: 0 },
    blankAmount: { type: "number", minimum: 0 },
    sampledVolume: { type: "number", exclusiveMinimum: 0 },
    captureFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "collectedAmount",
    "blankAmount",
    "sampledVolume",
    "captureFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netAmount: { type: "number" },
    correctedConcentration: { type: "number" },
  },
  required: ["netAmount", "correctedConcentration"],
} as const;
/** Signed field-blank correction followed by explicit capture-efficiency adjustment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedAmount, blankAmount, sampledVolume, captureFraction } =
    request;
  const compute = (): Output => {
    H.domain(collectedAmount >= 0 && blankAmount >= 0);
    H.positive(sampledVolume);
    H.domain(captureFraction > 0 && captureFraction <= 1);
    return {
      netAmount: collectedAmount - blankAmount,
      correctedConcentration:
        (collectedAmount - blankAmount) / (sampledVolume * captureFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectedAmount: 10,
    blankAmount: 2,
    sampledVolume: 4,
    captureFraction: 0.5,
  },
  output: { netAmount: 8, correctedConcentration: 4 },
} satisfies ToolExample<Input, Output>;
export const denuderCaptureBackgroundCorrectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/denuder-capture-background-correction-term",
      title: "Denuder Capture Background Correction Term Tool",
      description:
        "Signed field-blank correction followed by explicit capture-efficiency adjustment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          collectedAmount: { type: "number", minimum: 0 },
          blankAmount: { type: "number", minimum: 0 },
          sampledVolume: { type: "number", exclusiveMinimum: 0 },
          captureFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: [
          "collectedAmount",
          "blankAmount",
          "sampledVolume",
          "captureFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netAmount: { type: "number" },
          correctedConcentration: { type: "number" },
        },
        required: ["netAmount", "correctedConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "collectedAmount",
            label: "Collected Amount",
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
            id: "sampledVolume",
            label: "Sampled Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "captureFraction",
            label: "Capture Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netAmount",
            label: "Net Amount",
            valueType: { type: "number" },
          },
          {
            id: "correctedConcentration",
            label: "Corrected Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = denuderCaptureBackgroundCorrectionTermTool.execute;
export default denuderCaptureBackgroundCorrectionTermTool;
