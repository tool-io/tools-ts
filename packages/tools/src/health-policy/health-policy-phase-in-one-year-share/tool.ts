import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly year: number;
  readonly startYear: number;
  readonly years: number;
  readonly startFraction: number;
  readonly endFraction: number;
};
export type Output = { readonly progress: number; readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    startYear: { type: "integer" },
    years: { type: "integer", minimum: 1 },
    startFraction: { type: "number", minimum: 0, maximum: 1 },
    endFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["year", "startYear", "years", "startFraction", "endFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { progress: { type: "number" }, fraction: { type: "number" } },
  required: ["progress", "fraction"],
} as const;
/** Calculate health policy phase in one year share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, startYear, years, startFraction, endFraction } = request;
  const compute = (): Output => {
    H.integer(years, 1);
    H.probability(startFraction);
    H.probability(endFraction);
    return {
      progress: Math.min(1, Math.max(0, (year - startYear) / years)),
      fraction:
        startFraction +
        (endFraction - startFraction) *
          Math.min(1, Math.max(0, (year - startYear) / years)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    year: 2028,
    startYear: 2026,
    years: 4,
    startFraction: 0.2,
    endFraction: 1,
  },
  output: { progress: 0.5, fraction: 0.6000000000000001 },
} satisfies ToolExample<Input, Output>;
export const healthPolicyPhaseInOneYearShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/health-policy-phase-in-one-year-share",
    title: "Health Policy Phase In One Year Share Tool",
    description:
      "Calculate health policy phase in one year share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        startYear: { type: "integer" },
        years: { type: "integer", minimum: 1 },
        startFraction: { type: "number", minimum: 0, maximum: 1 },
        endFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["year", "startYear", "years", "startFraction", "endFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        progress: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["progress", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "startYear",
          label: "Start Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "startFraction",
          label: "Start Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endFraction",
          label: "End Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "progress", label: "Progress", valueType: { type: "number" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = healthPolicyPhaseInOneYearShareTool.execute;
export default healthPolicyPhaseInOneYearShareTool;
