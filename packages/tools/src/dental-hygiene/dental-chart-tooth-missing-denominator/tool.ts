import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedTeeth: number;
  readonly missingTeeth: number;
  readonly excludeMissing: boolean;
};
export type Output = { readonly denominator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedTeeth: { type: "integer", minimum: 0 },
    missingTeeth: { type: "integer", minimum: 0 },
    excludeMissing: { type: "boolean" },
  },
  required: ["plannedTeeth", "missingTeeth", "excludeMissing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" } },
  required: ["denominator"],
} as const;
/** Choose a supplied dental-chart tooth count denominator with an explicit missing-tooth exclusion flag without selecting an index definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedTeeth, missingTeeth, excludeMissing } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(plannedTeeth) &&
        plannedTeeth >= 0 &&
        plannedTeeth <= Number.MAX_SAFE_INTEGER,
      "plannedTeeth",
    ),
      plannedTeeth);
    (H.domain(
      Number.isSafeInteger(missingTeeth) &&
        missingTeeth >= 0 &&
        missingTeeth <= plannedTeeth,
      "missingTeeth",
    ),
      missingTeeth);
    return { denominator: plannedTeeth - (excludeMissing ? missingTeeth : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedTeeth: 28, missingTeeth: 4, excludeMissing: true },
  output: { denominator: 24 },
} satisfies ToolExample<Input, Output>;
export const dentalChartToothMissingDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/dental-chart-tooth-missing-denominator",
    title: "Dental Chart Tooth Missing Denominator Tool",
    description:
      "Choose a supplied dental-chart tooth count denominator with an explicit missing-tooth exclusion flag without selecting an index definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedTeeth: { type: "integer", minimum: 0 },
        missingTeeth: { type: "integer", minimum: 0 },
        excludeMissing: { type: "boolean" },
      },
      required: ["plannedTeeth", "missingTeeth", "excludeMissing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { denominator: { type: "integer" } },
      required: ["denominator"],
    },
    ports: {
      inputs: [
        {
          id: "plannedTeeth",
          label: "Planned Teeth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missingTeeth",
          label: "Missing Teeth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeMissing",
          label: "Exclude Missing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dentalChartToothMissingDenominatorTool.execute;
export default dentalChartToothMissingDenominatorTool;
