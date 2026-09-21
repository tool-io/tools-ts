import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredPeriods: number;
  readonly expectedPeriods: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredPeriods: { type: "integer", minimum: 0 },
    expectedPeriods: { type: "integer", minimum: 0 },
  },
  required: ["coveredPeriods", "expectedPeriods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate regional series coverage share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredPeriods, expectedPeriods } = request;
  const compute = (): Output => {
    H.integer(expectedPeriods, 0);
    H.integer(coveredPeriods, 0, expectedPeriods);
    return {
      share: expectedPeriods > 0 ? coveredPeriods / expectedPeriods : 0,
      defined: expectedPeriods > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coveredPeriods: 8, expectedPeriods: 10 },
  output: { share: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const regionalSeriesCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/regional-series-coverage-share",
    title: "Regional Series Coverage Share Tool",
    description:
      "Calculate regional series coverage share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredPeriods: { type: "integer", minimum: 0 },
        expectedPeriods: { type: "integer", minimum: 0 },
      },
      required: ["coveredPeriods", "expectedPeriods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "coveredPeriods",
          label: "Covered Periods",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expectedPeriods",
          label: "Expected Periods",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = regionalSeriesCoverageShareTool.execute;
export default regionalSeriesCoverageShareTool;
