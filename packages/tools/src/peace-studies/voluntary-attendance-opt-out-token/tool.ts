import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: string;
  readonly optOutToken: string;
  readonly noResponseToken: string;
};
export type Output = { readonly category: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    optOutToken: { type: "string", maxLength: 8192 },
    noResponseToken: { type: "string", maxLength: 8192 },
  },
  required: ["response", "optOutToken", "noResponseToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { category: { type: "string", maxLength: 8192 } },
  required: ["category"],
} as const;
/** Preserve explicit voluntary opt-out versus unanswered attendance records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, optOutToken, noResponseToken } = request;
  const compute = (): Output => {
    H.domain(optOutToken !== noResponseToken);
    return {
      category:
        response === optOutToken
          ? "opted-out"
          : response === noResponseToken
            ? "unanswered"
            : "responded",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: "decline", optOutToken: "decline", noResponseToken: "" },
  output: { category: "opted-out" },
} satisfies ToolExample<Input, Output>;
export const voluntaryAttendanceOptOutTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/voluntary-attendance-opt-out-token",
    title: "Voluntary Attendance Opt Out Token Tool",
    description:
      "Preserve explicit voluntary opt-out versus unanswered attendance records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "string", maxLength: 8192 },
        optOutToken: { type: "string", maxLength: 8192 },
        noResponseToken: { type: "string", maxLength: 8192 },
      },
      required: ["response", "optOutToken", "noResponseToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { category: { type: "string", maxLength: 8192 } },
      required: ["category"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "optOutToken",
          label: "Opt Out Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "noResponseToken",
          label: "No Response Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "category", label: "Category", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = voluntaryAttendanceOptOutTokenTool.execute;
export default voluntaryAttendanceOptOutTokenTool;
