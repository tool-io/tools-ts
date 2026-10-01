import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly containerMass: number;
  readonly excludedMass: number;
  readonly suppliedReportingFactor: number;
};
export type Output = {
  readonly netMass: number;
  readonly reportedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    containerMass: { type: "number", minimum: 0 },
    excludedMass: { type: "number", minimum: 0 },
    suppliedReportingFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "grossMass",
    "containerMass",
    "excludedMass",
    "suppliedReportingFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netMass: { type: "number" }, reportedMass: { type: "number" } },
  required: ["netMass", "reportedMass"],
} as const;
/** Apply supplied sample tare/exclusion accounting and a reporting factor without interpreting pathology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, containerMass, excludedMass, suppliedReportingFactor } =
    request;
  const compute = (): Output => {
    H.domain(
      grossMass >= 0 &&
        containerMass >= 0 &&
        excludedMass >= 0 &&
        containerMass + excludedMass <= grossMass,
    );
    H.positive(suppliedReportingFactor);
    return {
      netMass: grossMass - containerMass - excludedMass,
      reportedMass:
        (grossMass - containerMass - excludedMass) * suppliedReportingFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 120,
    containerMass: 20,
    excludedMass: 10,
    suppliedReportingFactor: 0.5,
  },
  output: { netMass: 90, reportedMass: 45 },
} satisfies ToolExample<Input, Output>;
export const placentaSampleBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/placenta-sample-basis-factor",
    title: "Placenta Sample Basis Factor Tool",
    description:
      "Apply supplied sample tare/exclusion accounting and a reporting factor without interpreting pathology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        containerMass: { type: "number", minimum: 0 },
        excludedMass: { type: "number", minimum: 0 },
        suppliedReportingFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "grossMass",
        "containerMass",
        "excludedMass",
        "suppliedReportingFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        reportedMass: { type: "number" },
      },
      required: ["netMass", "reportedMass"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "containerMass",
          label: "Container Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedMass",
          label: "Excluded Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReportingFactor",
          label: "Supplied Reporting Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        {
          id: "reportedMass",
          label: "Reported Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = placentaSampleBasisFactorTool.execute;
export default placentaSampleBasisFactorTool;
