import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorCredits: number;
  readonly recognizedCredits: number;
  readonly expiredCredits: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorCredits: { type: "number", minimum: 0 },
    recognizedCredits: { type: "number", minimum: 0 },
    expiredCredits: { type: "number", minimum: 0 },
  },
  required: ["priorCredits", "recognizedCredits", "expiredCredits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "number" } },
  required: ["closingBalance"],
} as const;
/** Calculate an explicit adult-course credit balance from prior, newly recognized and expired credit values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorCredits, recognizedCredits, expiredCredits } = request;
  const compute = (): Output => {
    H.domain(priorCredits >= 0, "priorCredits");
    H.domain(recognizedCredits >= 0, "recognizedCredits");
    H.domain(expiredCredits >= 0, "expiredCredits");
    return {
      closingBalance: priorCredits + recognizedCredits - expiredCredits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorCredits: 20, recognizedCredits: 8, expiredCredits: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const adultCourseReentryCreditBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/adult-course-reentry-credit-balance",
    title: "Adult Course Reentry Credit Balance",
    description:
      "Calculate an explicit adult-course credit balance from prior, newly recognized and expired credit values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorCredits: { type: "number", minimum: 0 },
        recognizedCredits: { type: "number", minimum: 0 },
        expiredCredits: { type: "number", minimum: 0 },
      },
      required: ["priorCredits", "recognizedCredits", "expiredCredits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingBalance: { type: "number" } },
      required: ["closingBalance"],
    },
    ports: {
      inputs: [
        {
          id: "priorCredits",
          label: "Prior Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recognizedCredits",
          label: "Recognized Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expiredCredits",
          label: "Expired Credits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingBalance",
          label: "Closing Balance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = adultCourseReentryCreditBalanceTool.execute;
export default adultCourseReentryCreditBalanceTool;
