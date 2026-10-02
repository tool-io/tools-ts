import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly absorptionRate: number;
  readonly eliminationRate: number;
  readonly time: number;
};
export type Output = {
  readonly rateGap: number;
  readonly timeFactor: number;
  readonly peakTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absorptionRate: { type: "number", exclusiveMinimum: 0 },
    eliminationRate: { type: "number", exclusiveMinimum: 0 },
    time: { type: "number" },
  },
  required: ["absorptionRate", "eliminationRate", "time"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rateGap: { type: "number" },
    timeFactor: { type: "number" },
    peakTime: { type: "number" },
  },
  required: ["rateGap", "timeFactor", "peakTime"],
} as const;
/** Research Bateman exponential-difference factor with the equal-rate limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { absorptionRate, eliminationRate, time } = request;
  const compute = (): Output => {
    H.positive(absorptionRate);
    H.positive(eliminationRate);
    H.domain(time >= 0, "time");
    const gap = absorptionRate - eliminationRate,
      timeFactor =
        gap === 0
          ? time * Math.exp(-eliminationRate * time)
          : gap > 0
            ? (Math.exp(-eliminationRate * time) * -Math.expm1(-gap * time)) /
              gap
            : (Math.exp(-absorptionRate * time) * -Math.expm1(gap * time)) /
              -gap,
      logRatio =
        Math.abs(gap) < 0.5 * eliminationRate
          ? Math.log1p(gap / eliminationRate)
          : Math.log(absorptionRate) - Math.log(eliminationRate);
    return {
      rateGap: gap,
      timeFactor,
      peakTime: gap === 0 ? 1 / eliminationRate : logRatio / gap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { absorptionRate: 2, eliminationRate: 1, time: 1 },
  output: {
    rateGap: 1,
    timeFactor: 0.23254415793482963,
    peakTime: 0.6931471805599453,
  },
} satisfies ToolExample<Input, Output>;
export const pkAbsorptionEliminationRateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-absorption-elimination-rate-gap",
    title: "PK Absorption Elimination Rate Gap Tool",
    description:
      "Research Bateman exponential-difference factor with the equal-rate limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absorptionRate: { type: "number", exclusiveMinimum: 0 },
        eliminationRate: { type: "number", exclusiveMinimum: 0 },
        time: { type: "number" },
      },
      required: ["absorptionRate", "eliminationRate", "time"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rateGap: { type: "number" },
        timeFactor: { type: "number" },
        peakTime: { type: "number" },
      },
      required: ["rateGap", "timeFactor", "peakTime"],
    },
    ports: {
      inputs: [
        {
          id: "absorptionRate",
          label: "Absorption Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eliminationRate",
          label: "Elimination Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rateGap", label: "Rate Gap", valueType: { type: "number" } },
        {
          id: "timeFactor",
          label: "Time Factor",
          valueType: { type: "number" },
        },
        { id: "peakTime", label: "Peak Time", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pkAbsorptionEliminationRateGapTool.execute;
export default pkAbsorptionEliminationRateGapTool;
