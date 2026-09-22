import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly highWaterVolume: number;
  readonly lowWaterVolume: number;
  readonly freshwaterInflow: number;
};
export type Output = {
  readonly tidalPrism: number;
  readonly fractionExchanged: number;
  readonly adjustedMarineExchange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    highWaterVolume: { type: "number", exclusiveMinimum: 0 },
    lowWaterVolume: { type: "number", minimum: 0 },
    freshwaterInflow: { type: "number", minimum: 0 },
  },
  required: ["highWaterVolume", "lowWaterVolume", "freshwaterInflow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tidalPrism: { type: "number" },
    fractionExchanged: { type: "number" },
    adjustedMarineExchange: { type: "number" },
  },
  required: ["tidalPrism", "fractionExchanged", "adjustedMarineExchange"],
} as const;
/** Volume-difference prism with a supplied freshwater correction; not a flushing-time or mixing-efficiency estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { highWaterVolume, lowWaterVolume, freshwaterInflow } = request;
  const compute = (): Output => {
    H.positive(highWaterVolume);
    H.domain(
      lowWaterVolume >= 0 &&
        lowWaterVolume <= highWaterVolume &&
        freshwaterInflow >= 0,
    );
    return {
      tidalPrism: highWaterVolume - lowWaterVolume,
      fractionExchanged: (highWaterVolume - lowWaterVolume) / highWaterVolume,
      adjustedMarineExchange:
        highWaterVolume - lowWaterVolume - freshwaterInflow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { highWaterVolume: 1000, lowWaterVolume: 700, freshwaterInflow: 50 },
  output: {
    tidalPrism: 300,
    fractionExchanged: 0.3,
    adjustedMarineExchange: 250,
  },
} satisfies ToolExample<Input, Output>;
export const estuaryTidalPrismVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/estuary-tidal-prism-volume-term",
    title: "Estuary Tidal Prism Volume Term Tool",
    description:
      "Volume-difference prism with a supplied freshwater correction; not a flushing-time or mixing-efficiency estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        highWaterVolume: { type: "number", exclusiveMinimum: 0 },
        lowWaterVolume: { type: "number", minimum: 0 },
        freshwaterInflow: { type: "number", minimum: 0 },
      },
      required: ["highWaterVolume", "lowWaterVolume", "freshwaterInflow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tidalPrism: { type: "number" },
        fractionExchanged: { type: "number" },
        adjustedMarineExchange: { type: "number" },
      },
      required: ["tidalPrism", "fractionExchanged", "adjustedMarineExchange"],
    },
    ports: {
      inputs: [
        {
          id: "highWaterVolume",
          label: "High Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowWaterVolume",
          label: "Low Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freshwaterInflow",
          label: "Freshwater Inflow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tidalPrism",
          label: "Tidal Prism",
          valueType: { type: "number" },
        },
        {
          id: "fractionExchanged",
          label: "Fraction Exchanged",
          valueType: { type: "number" },
        },
        {
          id: "adjustedMarineExchange",
          label: "Adjusted Marine Exchange",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = estuaryTidalPrismVolumeTermTool.execute;
export default estuaryTidalPrismVolumeTermTool;
