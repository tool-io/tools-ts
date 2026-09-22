import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exchangedVolume: number;
  readonly tankVolume: number;
  readonly cycles: number;
  readonly independentCompleteMixing: boolean;
};
export type Output = {
  readonly singleFraction: number;
  readonly retainedOriginalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exchangedVolume: { type: "number", minimum: 0 },
    tankVolume: { type: "number", exclusiveMinimum: 0 },
    cycles: { type: "integer", minimum: 0 },
    independentCompleteMixing: { type: "boolean" },
  },
  required: [
    "exchangedVolume",
    "tankVolume",
    "cycles",
    "independentCompleteMixing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    singleFraction: { type: "number" },
    retainedOriginalFraction: { type: "number" },
  },
  required: ["singleFraction", "retainedOriginalFraction"],
} as const;
/** Compare explicit complete-mixing versus non-repeated-original-water bookkeeping assumptions; no water-exchange recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exchangedVolume, tankVolume, cycles, independentCompleteMixing } =
    request;
  const compute = (): Output => {
    H.positive(tankVolume);
    H.integer(cycles, 0);
    H.domain(exchangedVolume >= 0 && exchangedVolume <= tankVolume);
    return {
      singleFraction: exchangedVolume / tankVolume,
      retainedOriginalFraction: independentCompleteMixing
        ? (1 - exchangedVolume / tankVolume) ** cycles
        : Math.max(0, 1 - (cycles * exchangedVolume) / tankVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exchangedVolume: 20,
    tankVolume: 100,
    cycles: 2,
    independentCompleteMixing: true,
  },
  output: { singleFraction: 0.2, retainedOriginalFraction: 0.6400000000000001 },
} satisfies ToolExample<Input, Output>;
export const tankExchangeFractionPerCycleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/tank-exchange-fraction-per-cycle",
    title: "Tank Exchange Fraction Per Cycle Tool",
    description:
      "Compare explicit complete-mixing versus non-repeated-original-water bookkeeping assumptions; no water-exchange recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exchangedVolume: { type: "number", minimum: 0 },
        tankVolume: { type: "number", exclusiveMinimum: 0 },
        cycles: { type: "integer", minimum: 0 },
        independentCompleteMixing: { type: "boolean" },
      },
      required: [
        "exchangedVolume",
        "tankVolume",
        "cycles",
        "independentCompleteMixing",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        singleFraction: { type: "number" },
        retainedOriginalFraction: { type: "number" },
      },
      required: ["singleFraction", "retainedOriginalFraction"],
    },
    ports: {
      inputs: [
        {
          id: "exchangedVolume",
          label: "Exchanged Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tankVolume",
          label: "Tank Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycles",
          label: "Cycles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "independentCompleteMixing",
          label: "Independent Complete Mixing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "singleFraction",
          label: "Single Fraction",
          valueType: { type: "number" },
        },
        {
          id: "retainedOriginalFraction",
          label: "Retained Original Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tankExchangeFractionPerCycleTool.execute;
export default tankExchangeFractionPerCycleTool;
