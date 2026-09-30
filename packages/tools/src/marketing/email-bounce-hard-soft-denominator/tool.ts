import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sent: number;
  readonly hardBounces: number;
  readonly softBounces: number;
  readonly excludeSoft: boolean;
};
export type Output = {
  readonly delivered: number;
  readonly denominator: number;
  readonly bounceFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sent: { type: "integer", minimum: 1 },
    hardBounces: { type: "integer", minimum: 0 },
    softBounces: { type: "integer", minimum: 0 },
    excludeSoft: { type: "boolean" },
  },
  required: ["sent", "hardBounces", "softBounces", "excludeSoft"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delivered: { type: "integer" },
    denominator: { type: "integer" },
    bounceFraction: { type: "number" },
  },
  required: ["delivered", "denominator", "bounceFraction"],
} as const;
/** Calculate email bounce hard soft denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sent, hardBounces, softBounces, excludeSoft } = request;
  const compute = (): Output => {
    H.integer(sent, 1);
    H.integer(hardBounces, 0, sent);
    H.integer(softBounces, 0, sent - hardBounces);
    H.domain(!excludeSoft || sent > softBounces);
    return {
      delivered: sent - hardBounces - softBounces,
      denominator: excludeSoft ? sent - softBounces : sent,
      bounceFraction: excludeSoft
        ? hardBounces / (sent - softBounces)
        : (hardBounces + softBounces) / sent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sent: 100, hardBounces: 5, softBounces: 15, excludeSoft: true },
  output: {
    delivered: 80,
    denominator: 85,
    bounceFraction: 0.058823529411764705,
  },
} satisfies ToolExample<Input, Output>;
export const emailBounceHardSoftDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/email-bounce-hard-soft-denominator",
    title: "Email Bounce Hard Soft Denominator Tool",
    description:
      "Calculate email bounce hard soft denominator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sent: { type: "integer", minimum: 1 },
        hardBounces: { type: "integer", minimum: 0 },
        softBounces: { type: "integer", minimum: 0 },
        excludeSoft: { type: "boolean" },
      },
      required: ["sent", "hardBounces", "softBounces", "excludeSoft"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delivered: { type: "integer" },
        denominator: { type: "integer" },
        bounceFraction: { type: "number" },
      },
      required: ["delivered", "denominator", "bounceFraction"],
    },
    ports: {
      inputs: [
        {
          id: "sent",
          label: "Sent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hardBounces",
          label: "Hard Bounces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "softBounces",
          label: "Soft Bounces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeSoft",
          label: "Exclude Soft",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "delivered", label: "Delivered", valueType: { type: "integer" } },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "bounceFraction",
          label: "Bounce Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = emailBounceHardSoftDenominatorTool.execute;
export default emailBounceHardSoftDenominatorTool;
