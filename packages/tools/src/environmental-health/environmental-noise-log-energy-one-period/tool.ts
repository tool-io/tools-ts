import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levelsDb: readonly number[];
  readonly durations: readonly number[];
};
export type Output = {
  readonly equivalentDb: number;
  readonly totalDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levelsDb: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["levelsDb", "durations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentDb: { type: "number" },
    totalDuration: { type: "number" },
  },
  required: ["equivalentDb", "totalDuration"],
} as const;
/** Energy-average supplied sound levels with duration weights and a stable logarithmic scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levelsDb, durations } = request;
  const compute = (): Output => {
    H.sameLength(levelsDb, durations);
    H.domain(
      levelsDb.length > 0 &&
        durations.every((x) => x >= 0) &&
        durations.some((x) => x > 0),
      "durations",
    );
    const max = Math.max(...levelsDb.filter((_, i) => durations[i] > 0)),
      totalDuration = durations.reduce((a, b) => a + b, 0),
      energy = levelsDb.reduce(
        (a, x, i) =>
          a +
          (durations[i] === 0
            ? 0
            : (durations[i] / totalDuration) * 10 ** ((x - max) / 10)),
        0,
      );
    return { equivalentDb: max + 10 * Math.log10(energy), totalDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { levelsDb: [60, 70], durations: [1, 1] },
  output: { equivalentDb: 67.40362689494243, totalDuration: 2 },
} satisfies ToolExample<Input, Output>;
export const environmentalNoiseLogEnergyOnePeriodTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/environmental-noise-log-energy-one-period",
      title: "Environmental Noise Log Energy One Period Tool",
      description:
        "Energy-average supplied sound levels with duration weights and a stable logarithmic scale.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          levelsDb: { type: "array", maxItems: 256, items: { type: "number" } },
          durations: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["levelsDb", "durations"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equivalentDb: { type: "number" },
          totalDuration: { type: "number" },
        },
        required: ["equivalentDb", "totalDuration"],
      },
      ports: {
        inputs: [
          {
            id: "levelsDb",
            label: "Levels Db",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "durations",
            label: "Durations",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "equivalentDb",
            label: "Equivalent Db",
            valueType: { type: "number" },
          },
          {
            id: "totalDuration",
            label: "Total Duration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = environmentalNoiseLogEnergyOnePeriodTool.execute;
export default environmentalNoiseLogEnergyOnePeriodTool;
