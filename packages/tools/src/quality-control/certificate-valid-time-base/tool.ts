import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly expires: number;
  readonly checked: number;
  readonly includeExpiry: boolean;
};
export type Output = {
  readonly age: number;
  readonly remaining: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer" },
    expires: { type: "integer" },
    checked: { type: "integer" },
    includeExpiry: { type: "boolean" },
  },
  required: ["issued", "expires", "checked", "includeExpiry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "integer" },
    remaining: { type: "integer" },
    withinWindow: { type: "boolean" },
  },
  required: ["age", "remaining", "withinWindow"],
} as const;
/** Compare supplied certificate time indices and endpoint rules without authenticating the certificate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, expires, checked, includeExpiry } = request;
  const compute = (): Output => {
    H.domain(issued <= expires);
    return {
      age: checked - issued,
      remaining: expires - checked,
      withinWindow:
        checked >= issued &&
        (includeExpiry ? checked <= expires : checked < expires),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 10, expires: 20, checked: 20, includeExpiry: true },
  output: { age: 10, remaining: 0, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const certificateValidTimeBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/certificate-valid-time-base",
    title: "Certificate Valid Time Base Tool",
    description:
      "Compare supplied certificate time indices and endpoint rules without authenticating the certificate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "integer" },
        expires: { type: "integer" },
        checked: { type: "integer" },
        includeExpiry: { type: "boolean" },
      },
      required: ["issued", "expires", "checked", "includeExpiry"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "integer" },
        remaining: { type: "integer" },
        withinWindow: { type: "boolean" },
      },
      required: ["age", "remaining", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expires",
          label: "Expires",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "checked",
          label: "Checked",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeExpiry",
          label: "Include Expiry",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = certificateValidTimeBaseTool.execute;
export default certificateValidTimeBaseTool;
