import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceAmounts: readonly number[];
  readonly creditDurations: readonly number[];
  readonly supportedDurations: readonly number[];
};
export type Output = {
  readonly amountTime: number;
  readonly supportedAmountTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceAmounts: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    creditDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    supportedDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["invoiceAmounts", "creditDurations", "supportedDurations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountTime: { type: "number" },
    supportedAmountTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["amountTime", "supportedAmountTime", "share", "defined"],
} as const;
/** Calculate trade credit window share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceAmounts, creditDurations, supportedDurations } = request;
  const compute = (): Output => {
    H.sameLength(invoiceAmounts, creditDurations);
    H.sameLength(invoiceAmounts, supportedDurations);
    H.domain(
      invoiceAmounts.every((x) => x >= 0) &&
        creditDurations.every(
          (x, i) =>
            x >= 0 && supportedDurations[i] >= 0 && supportedDurations[i] <= x,
        ),
    );
    return (() => {
      const amountTime = invoiceAmounts.reduce(
          (s, x, i) => s + x * creditDurations[i],
          0,
        ),
        supportedAmountTime = invoiceAmounts.reduce(
          (s, x, i) => s + x * supportedDurations[i],
          0,
        );
      return {
        amountTime,
        supportedAmountTime,
        share: amountTime > 0 ? supportedAmountTime / amountTime : 0,
        defined: amountTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invoiceAmounts: [10, 20],
    creditDurations: [5, 10],
    supportedDurations: [2, 5],
  },
  output: {
    amountTime: 250,
    supportedAmountTime: 120,
    share: 0.48,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const tradeCreditWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/trade-credit-window-share",
    title: "Trade Credit Window Share Tool",
    description:
      "Calculate trade credit window share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceAmounts: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        creditDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        supportedDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["invoiceAmounts", "creditDurations", "supportedDurations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountTime: { type: "number" },
        supportedAmountTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["amountTime", "supportedAmountTime", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "invoiceAmounts",
          label: "Invoice Amounts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "creditDurations",
          label: "Credit Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "supportedDurations",
          label: "Supported Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "amountTime",
          label: "Amount Time",
          valueType: { type: "number" },
        },
        {
          id: "supportedAmountTime",
          label: "Supported Amount Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = tradeCreditWindowShareTool.execute;
export default tradeCreditWindowShareTool;
