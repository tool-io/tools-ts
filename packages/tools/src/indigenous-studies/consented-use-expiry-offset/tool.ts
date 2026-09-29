import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly expiry: number; readonly useAt: number };
export type Output = { readonly remaining: number; readonly expired: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expiry: { type: "number" }, useAt: { type: "number" } },
  required: ["expiry", "useAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" }, expired: { type: "boolean" } },
  required: ["remaining", "expired"],
} as const;
/** Compare supplied use time to an exclusive consent expiry boundary without making a legal determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiry, useAt } = request;
  const compute = (): Output => {
    return { remaining: expiry - useAt, expired: useAt >= expiry };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expiry: 30, useAt: 20 },
  output: { remaining: 10, expired: false },
} satisfies ToolExample<Input, Output>;
export const consentedUseExpiryOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/consented-use-expiry-offset",
    title: "Consented Use Expiry Offset Tool",
    description:
      "Compare supplied use time to an exclusive consent expiry boundary without making a legal determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expiry: { type: "number" }, useAt: { type: "number" } },
      required: ["expiry", "useAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        expired: { type: "boolean" },
      },
      required: ["remaining", "expired"],
    },
    ports: {
      inputs: [
        {
          id: "expiry",
          label: "Expiry",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useAt",
          label: "Use At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "expired", label: "Expired", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = consentedUseExpiryOffsetTool.execute;
export default consentedUseExpiryOffsetTool;
