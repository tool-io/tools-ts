import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeCount: number;
  readonly afterCount: number;
};
export type Output = {
  readonly delta: number;
  readonly insertedCount: number;
  readonly removedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeCount: { type: "integer", minimum: 0 },
    afterCount: { type: "integer", minimum: 0 },
  },
  required: ["beforeCount", "afterCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delta: { type: "integer" },
    insertedCount: { type: "integer" },
    removedCount: { type: "integer" },
  },
  required: ["delta", "insertedCount", "removedCount"],
} as const;
/** Describe the multiplicity change of one multiset item, separating inserted and removed occurrence counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeCount, afterCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(beforeCount) &&
        beforeCount >= 0 &&
        beforeCount <= Number.MAX_SAFE_INTEGER,
      "beforeCount",
    ),
      beforeCount);
    (H.domain(
      Number.isSafeInteger(afterCount) &&
        afterCount >= 0 &&
        afterCount <= Number.MAX_SAFE_INTEGER,
      "afterCount",
    ),
      afterCount);
    return {
      delta: afterCount - beforeCount,
      insertedCount: Math.max(0, afterCount - beforeCount),
      removedCount: Math.max(0, beforeCount - afterCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeCount: 3, afterCount: 7 },
  output: { delta: 4, insertedCount: 4, removedCount: 0 },
} satisfies ToolExample<Input, Output>;
export const multisetItemCountDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/multiset-item-count-delta",
    title: "Multiset Item Count Delta Tool",
    description:
      "Describe the multiplicity change of one multiset item, separating inserted and removed occurrence counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeCount: { type: "integer", minimum: 0 },
        afterCount: { type: "integer", minimum: 0 },
      },
      required: ["beforeCount", "afterCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delta: { type: "integer" },
        insertedCount: { type: "integer" },
        removedCount: { type: "integer" },
      },
      required: ["delta", "insertedCount", "removedCount"],
    },
    ports: {
      inputs: [
        {
          id: "beforeCount",
          label: "Before Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "afterCount",
          label: "After Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
        {
          id: "insertedCount",
          label: "Inserted Count",
          valueType: { type: "integer" },
        },
        {
          id: "removedCount",
          label: "Removed Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = multisetItemCountDeltaTool.execute;
export default multisetItemCountDeltaTool;
