import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedPay: number;
  readonly suppliedHours: number;
};
export type Output = { readonly payPerHour: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedPay: { type: "number", minimum: 0 },
    suppliedHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedPay", "suppliedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { payPerHour: { type: "number" } },
  required: ["payPerHour"],
} as const;
/** Normalize an explicitly recorded pay amount to compatible supplied hours without inferring group pay gaps or causes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedPay, suppliedHours } = request;
  const compute = (): Output => {
    H.domain(recordedPay >= 0, "recordedPay");
    (H.domain(
      Number.isFinite(suppliedHours) && suppliedHours > 0,
      "suppliedHours",
    ),
      suppliedHours);
    return { payPerHour: recordedPay / suppliedHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedPay: 600, suppliedHours: 40 },
  output: { payPerHour: 15 },
} satisfies ToolExample<Input, Output>;
export const genderPayObservationHourBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["gender-studies", "gender studies", "social sciences"],
      keywords: ["gender studies", "social sciences"],
    },
    id: "gender-studies/gender-pay-observation-hour-basis",
    title: "Gender Pay Observation Hour Basis",
    description:
      "Normalize an explicitly recorded pay amount to compatible supplied hours without inferring group pay gaps or causes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedPay: { type: "number", minimum: 0 },
        suppliedHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedPay", "suppliedHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { payPerHour: { type: "number" } },
      required: ["payPerHour"],
    },
    ports: {
      inputs: [
        {
          id: "recordedPay",
          label: "Recorded Pay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHours",
          label: "Supplied Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "payPerHour",
          label: "Pay Per Hour",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = genderPayObservationHourBasisTool.execute;
export default genderPayObservationHourBasisTool;
