import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedAgeYears: number;
  readonly suppliedTopCodeYears: number;
};
export type Output = {
  readonly displayAge: string;
  readonly topCoded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAgeYears: { type: "number", minimum: 0 },
    suppliedTopCodeYears: { type: "number", minimum: 0 },
  },
  required: ["recordedAgeYears", "suppliedTopCodeYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayAge: { type: "string", maxLength: 8192 },
    topCoded: { type: "boolean" },
  },
  required: ["displayAge", "topCoded"],
} as const;
/** Top-code a supplied nonnegative age at an explicit inclusive threshold without claiming privacy-law compliance or complete deidentification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedAgeYears, suppliedTopCodeYears } = request;
  const compute = (): Output => {
    H.domain(recordedAgeYears >= 0, "recordedAgeYears");
    H.domain(suppliedTopCodeYears >= 0, "suppliedTopCodeYears");
    return {
      displayAge:
        recordedAgeYears >= suppliedTopCodeYears
          ? String(suppliedTopCodeYears) + "+"
          : String(recordedAgeYears),
      topCoded: recordedAgeYears >= suppliedTopCodeYears,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedAgeYears: 95, suppliedTopCodeYears: 90 },
  output: { displayAge: "90+", topCoded: true },
} satisfies ToolExample<Input, Output>;
export const emergencyDeidentifiedAgeTopCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/emergency-deidentified-age-top-code",
    title: "Emergency Deidentified Age Top Code Tool",
    description:
      "Top-code a supplied nonnegative age at an explicit inclusive threshold without claiming privacy-law compliance or complete deidentification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAgeYears: { type: "number", minimum: 0 },
        suppliedTopCodeYears: { type: "number", minimum: 0 },
      },
      required: ["recordedAgeYears", "suppliedTopCodeYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayAge: { type: "string", maxLength: 8192 },
        topCoded: { type: "boolean" },
      },
      required: ["displayAge", "topCoded"],
    },
    ports: {
      inputs: [
        {
          id: "recordedAgeYears",
          label: "Recorded Age Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTopCodeYears",
          label: "Supplied Top Code Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "displayAge",
          label: "Display Age",
          valueType: { type: "string" },
        },
        { id: "topCoded", label: "Top Coded", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = emergencyDeidentifiedAgeTopCodeTool.execute;
export default emergencyDeidentifiedAgeTopCodeTool;
