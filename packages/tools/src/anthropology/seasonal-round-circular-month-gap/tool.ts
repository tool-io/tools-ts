import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMonth: number;
  readonly secondMonth: number;
};
export type Output = {
  readonly forwardMonths: number;
  readonly shortestMonths: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMonth: { type: "integer", minimum: 1, maximum: 12 },
    secondMonth: { type: "integer", minimum: 1, maximum: 12 },
  },
  required: ["firstMonth", "secondMonth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardMonths: { type: "integer" },
    shortestMonths: { type: "integer" },
  },
  required: ["forwardMonths", "shortestMonths"],
} as const;
/** Calculate seasonal round circular month gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMonth, secondMonth } = request;
  const compute = (): Output => {
    H.integer(firstMonth, 1, 12);
    H.integer(secondMonth, 1, 12);
    return {
      forwardMonths: H.mod(secondMonth - firstMonth, 12),
      shortestMonths: Math.min(
        H.mod(secondMonth - firstMonth, 12),
        H.mod(firstMonth - secondMonth, 12),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstMonth: 11, secondMonth: 2 },
  output: { forwardMonths: 3, shortestMonths: 3 },
} satisfies ToolExample<Input, Output>;
export const seasonalRoundCircularMonthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/seasonal-round-circular-month-gap",
    title: "Seasonal Round Circular Month Gap Tool",
    description:
      "Calculate seasonal round circular month gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMonth: { type: "integer", minimum: 1, maximum: 12 },
        secondMonth: { type: "integer", minimum: 1, maximum: 12 },
      },
      required: ["firstMonth", "secondMonth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardMonths: { type: "integer" },
        shortestMonths: { type: "integer" },
      },
      required: ["forwardMonths", "shortestMonths"],
    },
    ports: {
      inputs: [
        {
          id: "firstMonth",
          label: "First Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondMonth",
          label: "Second Month",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "forwardMonths",
          label: "Forward Months",
          valueType: { type: "integer" },
        },
        {
          id: "shortestMonths",
          label: "Shortest Months",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = seasonalRoundCircularMonthGapTool.execute;
export default seasonalRoundCircularMonthGapTool;
