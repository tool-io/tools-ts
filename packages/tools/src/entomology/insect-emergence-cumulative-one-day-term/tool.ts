import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCumulative: number;
  readonly today: number;
  readonly expectedTotal: number;
};
export type Output = {
  readonly cumulative: number;
  readonly fraction: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCumulative: { type: "integer", minimum: 0 },
    today: { type: "integer", minimum: 0 },
    expectedTotal: { type: "integer", minimum: 1 },
  },
  required: ["previousCumulative", "today", "expectedTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cumulative: { type: "integer" },
    fraction: { type: "number" },
    remaining: { type: "integer" },
  },
  required: ["cumulative", "fraction", "remaining"],
} as const;
/** Calculate insect emergence cumulative one day term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCumulative, today, expectedTotal } = request;
  const compute = (): Output => {
    H.integer(expectedTotal, 1);
    H.integer(previousCumulative, 0);
    H.integer(today, 0);
    H.domain(previousCumulative + today <= expectedTotal);
    return {
      cumulative: previousCumulative + today,
      fraction: (previousCumulative + today) / expectedTotal,
      remaining: expectedTotal - previousCumulative - today,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCumulative: 20, today: 10, expectedTotal: 100 },
  output: { cumulative: 30, fraction: 0.3, remaining: 70 },
} satisfies ToolExample<Input, Output>;
export const insectEmergenceCumulativeOneDayTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entomology/insect-emergence-cumulative-one-day-term",
      title: "Insect Emergence Cumulative One Day Term Tool",
      description:
        "Calculate insect emergence cumulative one day term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousCumulative: { type: "integer", minimum: 0 },
          today: { type: "integer", minimum: 0 },
          expectedTotal: { type: "integer", minimum: 1 },
        },
        required: ["previousCumulative", "today", "expectedTotal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cumulative: { type: "integer" },
          fraction: { type: "number" },
          remaining: { type: "integer" },
        },
        required: ["cumulative", "fraction", "remaining"],
      },
      ports: {
        inputs: [
          {
            id: "previousCumulative",
            label: "Previous Cumulative",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "today",
            label: "Today",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expectedTotal",
            label: "Expected Total",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "cumulative",
            label: "Cumulative",
            valueType: { type: "integer" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = insectEmergenceCumulativeOneDayTermTool.execute;
export default insectEmergenceCumulativeOneDayTermTool;
