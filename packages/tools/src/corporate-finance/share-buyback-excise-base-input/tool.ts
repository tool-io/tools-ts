import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repurchaseValue: number;
  readonly suppliedExcludedValue: number;
  readonly suppliedOffsetValue: number;
};
export type Output = {
  readonly rawBase: number;
  readonly nonnegativeBase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repurchaseValue: { type: "number", minimum: 0 },
    suppliedExcludedValue: { type: "number", minimum: 0 },
    suppliedOffsetValue: { type: "number", minimum: 0 },
  },
  required: ["repurchaseValue", "suppliedExcludedValue", "suppliedOffsetValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawBase: { type: "number" },
    nonnegativeBase: { type: "number" },
  },
  required: ["rawBase", "nonnegativeBase"],
} as const;
/** Reconcile an explicitly supplied buyback tax base and its zero-floor variant without determining statutory exclusions, offsets or tax. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { repurchaseValue, suppliedExcludedValue, suppliedOffsetValue } =
    request;
  const compute = (): Output => {
    H.domain(repurchaseValue >= 0, "repurchaseValue");
    H.domain(suppliedExcludedValue >= 0, "suppliedExcludedValue");
    H.domain(suppliedOffsetValue >= 0, "suppliedOffsetValue");
    return (() => {
      const rawBase =
        repurchaseValue - suppliedExcludedValue - suppliedOffsetValue;
      return { rawBase, nonnegativeBase: Math.max(0, rawBase) };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    repurchaseValue: 1000,
    suppliedExcludedValue: 100,
    suppliedOffsetValue: 200,
  },
  output: { rawBase: 700, nonnegativeBase: 700 },
} satisfies ToolExample<Input, Output>;
export const shareBuybackExciseBaseInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/share-buyback-excise-base-input",
    title: "Share Buyback Excise Base Input",
    description:
      "Reconcile an explicitly supplied buyback tax base and its zero-floor variant without determining statutory exclusions, offsets or tax.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repurchaseValue: { type: "number", minimum: 0 },
        suppliedExcludedValue: { type: "number", minimum: 0 },
        suppliedOffsetValue: { type: "number", minimum: 0 },
      },
      required: [
        "repurchaseValue",
        "suppliedExcludedValue",
        "suppliedOffsetValue",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawBase: { type: "number" },
        nonnegativeBase: { type: "number" },
      },
      required: ["rawBase", "nonnegativeBase"],
    },
    ports: {
      inputs: [
        {
          id: "repurchaseValue",
          label: "Repurchase Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExcludedValue",
          label: "Supplied Excluded Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOffsetValue",
          label: "Supplied Offset Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawBase", label: "Raw Base", valueType: { type: "number" } },
        {
          id: "nonnegativeBase",
          label: "Nonnegative Base",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shareBuybackExciseBaseInputTool.execute;
export default shareBuybackExciseBaseInputTool;
