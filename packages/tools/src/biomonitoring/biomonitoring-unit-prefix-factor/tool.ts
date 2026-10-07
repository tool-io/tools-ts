import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedValue: number;
  readonly suppliedFactor: number;
};
export type Output = { readonly convertedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    suppliedFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reportedValue", "suppliedFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedValue: { type: "number" } },
  required: ["convertedValue"],
} as const;
/** Apply a caller-supplied positive unit-prefix factor to an explicit result without inferring analyte-specific conversion factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedValue, suppliedFactor } = request;
  const compute = (): Output => {
    (H.domain(suppliedFactor > 0, "suppliedFactor"), suppliedFactor);
    return { convertedValue: reportedValue * suppliedFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedValue: 2.5, suppliedFactor: 1000 },
  output: { convertedValue: 2500 },
} satisfies ToolExample<Input, Output>;
export const biomonitoringUnitPrefixFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomonitoring", "biology"],
      keywords: ["biomonitoring", "biology"],
    },
    id: "biomonitoring/biomonitoring-unit-prefix-factor",
    title: "Biomonitoring Unit Prefix Factor",
    description:
      "Apply a caller-supplied positive unit-prefix factor to an explicit result without inferring analyte-specific conversion factors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedValue: { type: "number" },
        suppliedFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reportedValue", "suppliedFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedValue: { type: "number" } },
      required: ["convertedValue"],
    },
    ports: {
      inputs: [
        {
          id: "reportedValue",
          label: "Reported Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFactor",
          label: "Supplied Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedValue",
          label: "Converted Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomonitoringUnitPrefixFactorTool.execute;
export default biomonitoringUnitPrefixFactorTool;
