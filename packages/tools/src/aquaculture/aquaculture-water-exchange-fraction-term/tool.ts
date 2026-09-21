import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly exchangedVolume: number;
  readonly exchanges: number;
};
export type Output = {
  readonly perExchangeFraction: number;
  readonly originalWaterRemainingFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", exclusiveMinimum: 0 },
    exchangedVolume: { type: "number", minimum: 0 },
    exchanges: { type: "integer", minimum: 0 },
  },
  required: ["volume", "exchangedVolume", "exchanges"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perExchangeFraction: { type: "number" },
    originalWaterRemainingFraction: { type: "number" },
  },
  required: ["perExchangeFraction", "originalWaterRemainingFraction"],
} as const;
/** Repeated complete-mixing drain-and-refill exchanges at constant total volume; new water contains none of the original tracer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, exchangedVolume, exchanges } = request;
  const compute = (): Output => {
    H.positive(volume);
    H.domain(exchangedVolume >= 0 && exchangedVolume <= volume);
    H.integer(exchanges, 0);
    return {
      perExchangeFraction: exchangedVolume / volume,
      originalWaterRemainingFraction:
        (1 - exchangedVolume / volume) ** exchanges,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 100, exchangedVolume: 20, exchanges: 3 },
  output: {
    perExchangeFraction: 0.2,
    originalWaterRemainingFraction: 0.5120000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const aquacultureWaterExchangeFractionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaculture/aquaculture-water-exchange-fraction-term",
      title: "Aquaculture Water Exchange Fraction Term Tool",
      description:
        "Repeated complete-mixing drain-and-refill exchanges at constant total volume; new water contains none of the original tracer.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          volume: { type: "number", exclusiveMinimum: 0 },
          exchangedVolume: { type: "number", minimum: 0 },
          exchanges: { type: "integer", minimum: 0 },
        },
        required: ["volume", "exchangedVolume", "exchanges"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perExchangeFraction: { type: "number" },
          originalWaterRemainingFraction: { type: "number" },
        },
        required: ["perExchangeFraction", "originalWaterRemainingFraction"],
      },
      ports: {
        inputs: [
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exchangedVolume",
            label: "Exchanged Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exchanges",
            label: "Exchanges",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "perExchangeFraction",
            label: "Per Exchange Fraction",
            valueType: { type: "number" },
          },
          {
            id: "originalWaterRemainingFraction",
            label: "Original Water Remaining Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquacultureWaterExchangeFractionTermTool.execute;
export default aquacultureWaterExchangeFractionTermTool;
