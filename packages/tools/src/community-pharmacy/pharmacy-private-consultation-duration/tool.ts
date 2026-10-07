import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consultStartMinutes: number;
  readonly consultEndMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consultStartMinutes: { type: "number" },
    consultEndMinutes: { type: "number" },
  },
  required: ["consultStartMinutes", "consultEndMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit consultation markers in minutes without assessing billing or service eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { consultStartMinutes, consultEndMinutes } = request;
  const compute = (): Output => {
    return { signedGap: consultEndMinutes - consultStartMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { consultStartMinutes: 12, consultEndMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const pharmacyPrivateconsultDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/pharmacy-private-consultation-duration",
    title: "Pharmacy Private Consultation Duration",
    description:
      "Subtract explicit consultation markers in minutes without assessing billing or service eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consultStartMinutes: { type: "number" },
        consultEndMinutes: { type: "number" },
      },
      required: ["consultStartMinutes", "consultEndMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "consultStartMinutes",
          label: "Consult Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "consultEndMinutes",
          label: "Consult End Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacyPrivateconsultDurationTool.execute;
export default pharmacyPrivateconsultDurationTool;
