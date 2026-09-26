import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemIds: readonly string[];
  readonly observed: readonly boolean[];
  readonly applicable: readonly boolean[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly applicableWeight: number;
  readonly observedWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    applicable: { type: "array", maxItems: 256, items: { type: "boolean" } },
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["itemIds", "observed", "applicable", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    applicableWeight: { type: "number" },
    observedWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["applicableWeight", "observedWeight", "share", "defined"],
} as const;
/** Measure explicitly weighted research item support without a psychological score or clinical classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemIds, observed, applicable, weights } = request;
  const compute = (): Output => {
    H.sameLength(itemIds, observed);
    H.sameLength(itemIds, applicable);
    H.sameLength(itemIds, weights);
    H.domain(
      new Set(itemIds).size === itemIds.length && weights.every((x) => x >= 0),
    );
    return (() => {
      const applicableWeight = weights.reduce(
          (s, x, i) => s + (applicable[i] ? x : 0),
          0,
        ),
        observedWeight = weights.reduce(
          (s, x, i) => s + (applicable[i] && observed[i] ? x : 0),
          0,
        );
      return {
        applicableWeight,
        observedWeight,
        share: applicableWeight > 0 ? observedWeight / applicableWeight : 0,
        defined: applicableWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemIds: ["a", "b"],
    observed: [true, false],
    applicable: [true, true],
    weights: [2, 3],
  },
  output: { applicableWeight: 5, observedWeight: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const itemObservationSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/item-observation-support-share",
    title: "Item Observation Support Share Tool",
    description:
      "Measure explicitly weighted research item support without a psychological score or clinical classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        applicable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["itemIds", "observed", "applicable", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        applicableWeight: { type: "number" },
        observedWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["applicableWeight", "observedWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "itemIds",
          label: "Item Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "applicable",
          label: "Applicable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "applicableWeight",
          label: "Applicable Weight",
          valueType: { type: "number" },
        },
        {
          id: "observedWeight",
          label: "Observed Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = itemObservationSupportShareTool.execute;
export default itemObservationSupportShareTool;
