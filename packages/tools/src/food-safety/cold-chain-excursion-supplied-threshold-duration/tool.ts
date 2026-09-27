import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly times: readonly number[];
  readonly temperatures: readonly number[];
  readonly threshold: number;
  readonly above: boolean;
};
export type Output = {
  readonly duration: number;
  readonly intervalCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    times: { type: "array", maxItems: 256, items: { type: "number" } },
    temperatures: { type: "array", maxItems: 256, items: { type: "number" } },
    threshold: { type: "number" },
    above: { type: "boolean" },
  },
  required: ["times", "temperatures", "threshold", "above"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duration: { type: "number" },
    intervalCount: { type: "integer" },
  },
  required: ["duration", "intervalCount"],
} as const;
/** Sum half-open logged intervals using each left-hand temperature and a strict supplied threshold. This does not infer food suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { times, temperatures, threshold, above } = request;
  const compute = (): Output => {
    H.sameLength(times, temperatures);
    H.domain(
      times.length >= 2 && times.every((t, i) => i === 0 || t > times[i - 1]),
    );
    let duration = 0,
      intervalCount = 0;
    for (let i = 0; i < times.length - 1; i++) {
      if (above ? temperatures[i] > threshold : temperatures[i] < threshold) {
        duration += times[i + 1] - times[i];
        intervalCount++;
      }
    }
    return { duration, intervalCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    times: [0, 10, 30, 40],
    temperatures: [3, 8, 9, 2],
    threshold: 5,
    above: true,
  },
  output: { duration: 30, intervalCount: 2 },
} satisfies ToolExample<Input, Output>;
export const coldChainExcursionSuppliedThresholdDurationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-safety/cold-chain-excursion-supplied-threshold-duration",
      title: "Cold Chain Excursion Supplied Threshold Duration Tool",
      description:
        "Sum half-open logged intervals using each left-hand temperature and a strict supplied threshold. This does not infer food suitability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          times: { type: "array", maxItems: 256, items: { type: "number" } },
          temperatures: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          threshold: { type: "number" },
          above: { type: "boolean" },
        },
        required: ["times", "temperatures", "threshold", "above"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          duration: { type: "number" },
          intervalCount: { type: "integer" },
        },
        required: ["duration", "intervalCount"],
      },
      ports: {
        inputs: [
          {
            id: "times",
            label: "Times",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "temperatures",
            label: "Temperatures",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "threshold",
            label: "Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "above",
            label: "Above",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "duration", label: "Duration", valueType: { type: "number" } },
          {
            id: "intervalCount",
            label: "Interval Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = coldChainExcursionSuppliedThresholdDurationTool.execute;
export default coldChainExcursionSuppliedThresholdDurationTool;
