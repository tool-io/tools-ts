import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowDurations: readonly number[];
  readonly observed: readonly boolean[];
  readonly suppliedWeights: readonly number[];
};
export type Output = {
  readonly weightedCovered: number;
  readonly weightedTotal: number;
  readonly fraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    suppliedWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["windowDurations", "observed", "suppliedWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedCovered: { type: "number" },
    weightedTotal: { type: "number" },
    fraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["weightedCovered", "weightedTotal", "fraction", "defined"],
} as const;
/** Measure supplied weighted observation coverage, not a decibel average or noise dose. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowDurations, observed, suppliedWeights } = request;
  const compute = (): Output => {
    H.sameLength(windowDurations, observed);
    H.sameLength(windowDurations, suppliedWeights);
    H.domain(
      windowDurations.every((x) => x >= 0) &&
        suppliedWeights.every((x) => x >= 0),
    );
    return {
      weightedCovered: windowDurations.reduce(
        (a, b, i) => a + (observed[i] ? b * suppliedWeights[i] : 0),
        0,
      ),
      weightedTotal: windowDurations.reduce(
        (a, b, i) => a + b * suppliedWeights[i],
        0,
      ),
      fraction:
        windowDurations.reduce((a, b, i) => a + b * suppliedWeights[i], 0) > 0
          ? windowDurations.reduce(
              (a, b, i) => a + (observed[i] ? b * suppliedWeights[i] : 0),
              0,
            ) /
            windowDurations.reduce((a, b, i) => a + b * suppliedWeights[i], 0)
          : 0,
      defined: windowDurations.some((x, i) => x * suppliedWeights[i] > 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    windowDurations: [2, 3],
    observed: [true, false],
    suppliedWeights: [2, 1],
  },
  output: {
    weightedCovered: 4,
    weightedTotal: 7,
    fraction: 0.5714285714285714,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const noiseWindowWeightCoverageTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/noise-window-weight-coverage-token",
    title: "Noise Window Weight Coverage Token Tool",
    description:
      "Measure supplied weighted observation coverage, not a decibel average or noise dose.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        suppliedWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["windowDurations", "observed", "suppliedWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedCovered: { type: "number" },
        weightedTotal: { type: "number" },
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["weightedCovered", "weightedTotal", "fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "windowDurations",
          label: "Window Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "suppliedWeights",
          label: "Supplied Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "weightedCovered",
          label: "Weighted Covered",
          valueType: { type: "number" },
        },
        {
          id: "weightedTotal",
          label: "Weighted Total",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = noiseWindowWeightCoverageTokenTool.execute;
export default noiseWindowWeightCoverageTokenTool;
