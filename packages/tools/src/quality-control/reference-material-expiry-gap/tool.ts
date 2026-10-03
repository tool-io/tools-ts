import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiry: number;
  readonly useAt: number;
  readonly inclusiveExpiry: boolean;
};
export type Output = {
  readonly remaining: number;
  readonly currentUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiry: { type: "number" },
    useAt: { type: "number" },
    inclusiveExpiry: { type: "boolean" },
  },
  required: ["expiry", "useAt", "inclusiveExpiry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    currentUnderRule: { type: "boolean" },
  },
  required: ["remaining", "currentUnderRule"],
} as const;
/** Compare supplied reference-material record coordinates without certifying material stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiry, useAt, inclusiveExpiry } = request;
  const compute = (): Output => {
    return {
      remaining: expiry - useAt,
      currentUnderRule: inclusiveExpiry ? useAt <= expiry : useAt < expiry,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expiry: 30, useAt: 20, inclusiveExpiry: false },
  output: { remaining: 10, currentUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const referenceMaterialExpiryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/reference-material-expiry-gap",
    title: "Reference Material Expiry Gap Tool",
    description:
      "Compare supplied reference-material record coordinates without certifying material stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiry: { type: "number" },
        useAt: { type: "number" },
        inclusiveExpiry: { type: "boolean" },
      },
      required: ["expiry", "useAt", "inclusiveExpiry"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        currentUnderRule: { type: "boolean" },
      },
      required: ["remaining", "currentUnderRule"],
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
        {
          id: "inclusiveExpiry",
          label: "Inclusive Expiry",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "currentUnderRule",
          label: "Current Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = referenceMaterialExpiryGapTool.execute;
export default referenceMaterialExpiryGapTool;
