import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seasonStart: number;
  readonly seasonEnd: number;
  readonly coveredIntervals: readonly (readonly number[])[];
};
export type Output = { readonly bareDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seasonStart: { type: "integer" },
    seasonEnd: { type: "integer" },
    coveredIntervals: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["seasonStart", "seasonEnd", "coveredIntervals"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bareDays: { type: "number" } },
  required: ["bareDays"],
} as const;
/** Calculate soil cover bare period duration term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seasonStart, seasonEnd, coveredIntervals } = request;
  const compute = (): Output => {
    H.domain(
      seasonEnd >= seasonStart &&
        coveredIntervals.every(
          (x, i) =>
            x.length === 2 &&
            x[0] >= seasonStart &&
            x[1] >= x[0] &&
            x[1] <= seasonEnd &&
            (i === 0 || x[0] >= coveredIntervals[i - 1][1]),
        ),
    );
    return {
      bareDays:
        seasonEnd -
        seasonStart -
        coveredIntervals.reduce((a, x) => a + x[1] - x[0], 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seasonStart: 0,
    seasonEnd: 100,
    coveredIntervals: [
      [10, 30],
      [50, 90],
    ],
  },
  output: { bareDays: 40 },
} satisfies ToolExample<Input, Output>;
export const soilCoverBarePeriodDurationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/soil-cover-bare-period-duration-term",
    title: "Soil Cover Bare Period Duration Term Tool",
    description:
      "Calculate soil cover bare period duration term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seasonStart: { type: "integer" },
        seasonEnd: { type: "integer" },
        coveredIntervals: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
      },
      required: ["seasonStart", "seasonEnd", "coveredIntervals"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bareDays: { type: "number" } },
      required: ["bareDays"],
    },
    ports: {
      inputs: [
        {
          id: "seasonStart",
          label: "Season Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "seasonEnd",
          label: "Season End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "coveredIntervals",
          label: "Covered Intervals",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
      ],
      outputs: [
        { id: "bareDays", label: "Bare Days", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilCoverBarePeriodDurationTermTool.execute;
export default soilCoverBarePeriodDurationTermTool;
