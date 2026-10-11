import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredLineCounts: readonly number[];
  readonly pickedLineCounts: readonly number[];
};
export type Output = {
  readonly complete: boolean;
  readonly shortfallByLine: readonly number[];
  readonly excessByLine: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLineCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    pickedLineCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["requiredLineCounts", "pickedLineCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complete: { type: "boolean" },
    shortfallByLine: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    excessByLine: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["complete", "shortfallByLine", "excessByLine"],
} as const;
/** Compare explicit required and picked quantities line by line without checking item identity or shipping an order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredLineCounts, pickedLineCounts } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(
        requiredLineCounts.length === pickedLineCounts.length,
        "pickedLineCounts",
      );
      requiredLineCounts.forEach(
        (value) => (
          H.domain(
            Number.isSafeInteger(value) &&
              value >= 0 &&
              value <= Number.MAX_SAFE_INTEGER,
            "requiredLineCounts",
          ),
          value
        ),
      );
      pickedLineCounts.forEach(
        (value) => (
          H.domain(
            Number.isSafeInteger(value) &&
              value >= 0 &&
              value <= Number.MAX_SAFE_INTEGER,
            "pickedLineCounts",
          ),
          value
        ),
      );
      const shortfallByLine = requiredLineCounts.map((value, index) =>
        Math.max(0, value - pickedLineCounts[index]),
      );
      return {
        complete: shortfallByLine.every((value) => value === 0),
        shortfallByLine,
        excessByLine: pickedLineCounts.map((value, index) =>
          Math.max(0, value - requiredLineCounts[index]),
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredLineCounts: [5, 3], pickedLineCounts: [5, 2] },
  output: { complete: false, shortfallByLine: [0, 1], excessByLine: [0, 0] },
} satisfies ToolExample<Input, Output>;
export const outboundOrderPickCompleteFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["supply-chain", "supply chain", "business and finance"],
      keywords: ["supply chain", "business and finance"],
    },
    id: "supply-chain/outbound-order-pick-complete-flag",
    title: "Outbound Order Pick Complete Flag",
    description:
      "Compare explicit required and picked quantities line by line without checking item identity or shipping an order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredLineCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        pickedLineCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["requiredLineCounts", "pickedLineCounts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        complete: { type: "boolean" },
        shortfallByLine: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        excessByLine: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["complete", "shortfallByLine", "excessByLine"],
    },
    ports: {
      inputs: [
        {
          id: "requiredLineCounts",
          label: "Required Line Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "pickedLineCounts",
          label: "Picked Line Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "complete", label: "Complete", valueType: { type: "boolean" } },
        {
          id: "shortfallByLine",
          label: "Shortfall By Line",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "excessByLine",
          label: "Excess By Line",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = outboundOrderPickCompleteFlagTool.execute;
export default outboundOrderPickCompleteFlagTool;
