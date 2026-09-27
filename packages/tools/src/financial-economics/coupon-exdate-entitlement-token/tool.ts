import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tradeDay: number;
  readonly exDay: number;
  readonly equalityExcludes: boolean;
  readonly settledBeforeRecord: boolean;
};
export type Output = {
  readonly beforeExDate: boolean;
  readonly entitledByFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tradeDay: { type: "integer" },
    exDay: { type: "integer" },
    equalityExcludes: { type: "boolean" },
    settledBeforeRecord: { type: "boolean" },
  },
  required: ["tradeDay", "exDay", "equalityExcludes", "settledBeforeRecord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeExDate: { type: "boolean" },
    entitledByFlags: { type: "boolean" },
  },
  required: ["beforeExDate", "entitledByFlags"],
} as const;
/** Evaluate supplied ex-date equality and settlement flags without selecting market settlement rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tradeDay, exDay, equalityExcludes, settledBeforeRecord } = request;
  const compute = (): Output => {
    const beforeExDate = equalityExcludes
      ? tradeDay < exDay
      : tradeDay <= exDay;
    return {
      beforeExDate,
      entitledByFlags: beforeExDate && settledBeforeRecord,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tradeDay: 10,
    exDay: 10,
    equalityExcludes: true,
    settledBeforeRecord: true,
  },
  output: { beforeExDate: false, entitledByFlags: false },
} satisfies ToolExample<Input, Output>;
export const couponExdateEntitlementTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/coupon-exdate-entitlement-token",
    title: "Coupon Exdate Entitlement Token Tool",
    description:
      "Evaluate supplied ex-date equality and settlement flags without selecting market settlement rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tradeDay: { type: "integer" },
        exDay: { type: "integer" },
        equalityExcludes: { type: "boolean" },
        settledBeforeRecord: { type: "boolean" },
      },
      required: [
        "tradeDay",
        "exDay",
        "equalityExcludes",
        "settledBeforeRecord",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeExDate: { type: "boolean" },
        entitledByFlags: { type: "boolean" },
      },
      required: ["beforeExDate", "entitledByFlags"],
    },
    ports: {
      inputs: [
        {
          id: "tradeDay",
          label: "Trade Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exDay",
          label: "Ex Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "equalityExcludes",
          label: "Equality Excludes",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "settledBeforeRecord",
          label: "Settled Before Record",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "beforeExDate",
          label: "Before Ex Date",
          valueType: { type: "boolean" },
        },
        {
          id: "entitledByFlags",
          label: "Entitled By Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = couponExdateEntitlementTokenTool.execute;
export default couponExdateEntitlementTokenTool;
