import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullDays: number;
  readonly partialDayFractions: readonly number[];
  readonly seasonDays: number;
};
export type Output = {
  readonly equivalentDays: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullDays: { type: "integer", minimum: 0 },
    partialDayFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    seasonDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["fullDays", "partialDayFractions", "seasonDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentDays: { type: "number" },
    coverage: { type: "number" },
  },
  required: ["equivalentDays", "coverage"],
} as const;
/** Calculate cover day partial season credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullDays, partialDayFractions, seasonDays } = request;
  const compute = (): Output => {
    H.integer(fullDays, 0);
    H.positive(seasonDays);
    H.domain(
      partialDayFractions.every((x) => x >= 0 && x <= 1) &&
        fullDays + partialDayFractions.reduce((a, b) => a + b, 0) <= seasonDays,
    );
    return {
      equivalentDays: fullDays + partialDayFractions.reduce((a, b) => a + b, 0),
      coverage:
        (fullDays + partialDayFractions.reduce((a, b) => a + b, 0)) /
        seasonDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullDays: 10, partialDayFractions: [0.5, 0.25], seasonDays: 20 },
  output: { equivalentDays: 10.75, coverage: 0.5375 },
} satisfies ToolExample<Input, Output>;
export const coverDayPartialSeasonCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/cover-day-partial-season-credit",
    title: "Cover Day Partial Season Credit Tool",
    description:
      "Calculate cover day partial season credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullDays: { type: "integer", minimum: 0 },
        partialDayFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        seasonDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["fullDays", "partialDayFractions", "seasonDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentDays: { type: "number" },
        coverage: { type: "number" },
      },
      required: ["equivalentDays", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "fullDays",
          label: "Full Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "partialDayFractions",
          label: "Partial Day Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "seasonDays",
          label: "Season Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentDays",
          label: "Equivalent Days",
          valueType: { type: "number" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coverDayPartialSeasonCreditTool.execute;
export default coverDayPartialSeasonCreditTool;
