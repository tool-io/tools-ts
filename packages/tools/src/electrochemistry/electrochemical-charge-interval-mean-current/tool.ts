import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meanCurrentAmperes: number;
  readonly intervalSeconds: number;
};
export type Output = { readonly chargeCoulombs: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanCurrentAmperes: { type: "number" },
    intervalSeconds: { type: "number", minimum: 0 },
  },
  required: ["meanCurrentAmperes", "intervalSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chargeCoulombs: { type: "number" } },
  required: ["chargeCoulombs"],
} as const;
/** Integrate an explicitly supplied interval-mean electrochemical current into signed charge without assuming a waveform. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meanCurrentAmperes, intervalSeconds } = request;
  const compute = (): Output => {
    H.domain(intervalSeconds >= 0, "intervalSeconds");
    return { chargeCoulombs: meanCurrentAmperes * intervalSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meanCurrentAmperes: 0.01, intervalSeconds: 60 },
  output: { chargeCoulombs: 0.6 },
} satisfies ToolExample<Input, Output>;
export const electrochemicalChargeIntervalMeanCurrentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["electrochemistry", "chemistry"],
        keywords: ["electrochemistry", "chemistry"],
      },
      id: "electrochemistry/electrochemical-charge-interval-mean-current",
      title: "Electrochemical Charge Interval Mean Current",
      description:
        "Integrate an explicitly supplied interval-mean electrochemical current into signed charge without assuming a waveform.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          meanCurrentAmperes: { type: "number" },
          intervalSeconds: { type: "number", minimum: 0 },
        },
        required: ["meanCurrentAmperes", "intervalSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { chargeCoulombs: { type: "number" } },
        required: ["chargeCoulombs"],
      },
      ports: {
        inputs: [
          {
            id: "meanCurrentAmperes",
            label: "Mean Current Amperes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intervalSeconds",
            label: "Interval Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "chargeCoulombs",
            label: "Charge Coulombs",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electrochemicalChargeIntervalMeanCurrentTool.execute;
export default electrochemicalChargeIntervalMeanCurrentTool;
