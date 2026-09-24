import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pauseDurations: readonly number[];
  readonly speakingDuration: number;
  readonly includePausesInDenominator: boolean;
};
export type Output = {
  readonly pauseTotal: number;
  readonly denominator: number;
  readonly pauseFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pauseDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    speakingDuration: { type: "number", minimum: 0 },
    includePausesInDenominator: { type: "boolean" },
  },
  required: [
    "pauseDurations",
    "speakingDuration",
    "includePausesInDenominator",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pauseTotal: { type: "number" },
    denominator: { type: "number" },
    pauseFraction: { type: "number" },
  },
  required: ["pauseTotal", "denominator", "pauseFraction"],
} as const;
/** Calculate dialogue pause density from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pauseDurations, speakingDuration, includePausesInDenominator } =
    request;
  const compute = (): Output => {
    H.domain(speakingDuration >= 0 && pauseDurations.every((x) => x >= 0));
    return (() => {
      const pauseTotal = pauseDurations.reduce((a, b) => a + b, 0),
        denominator =
          speakingDuration + (includePausesInDenominator ? pauseTotal : 0);
      H.positive(denominator);
      return {
        pauseTotal,
        denominator,
        pauseFraction: pauseTotal / denominator,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pauseDurations: [1, 2],
    speakingDuration: 7,
    includePausesInDenominator: true,
  },
  output: { pauseTotal: 3, denominator: 10, pauseFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const dialoguePauseDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/dialogue-pause-density",
    title: "Dialogue Pause Density Tool",
    description:
      "Calculate dialogue pause density from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pauseDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        speakingDuration: { type: "number", minimum: 0 },
        includePausesInDenominator: { type: "boolean" },
      },
      required: [
        "pauseDurations",
        "speakingDuration",
        "includePausesInDenominator",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pauseTotal: { type: "number" },
        denominator: { type: "number" },
        pauseFraction: { type: "number" },
      },
      required: ["pauseTotal", "denominator", "pauseFraction"],
    },
    ports: {
      inputs: [
        {
          id: "pauseDurations",
          label: "Pause Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "speakingDuration",
          label: "Speaking Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includePausesInDenominator",
          label: "Include Pauses In Denominator",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "pauseTotal",
          label: "Pause Total",
          valueType: { type: "number" },
        },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        {
          id: "pauseFraction",
          label: "Pause Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialoguePauseDensityTool.execute;
export default dialoguePauseDensityTool;
