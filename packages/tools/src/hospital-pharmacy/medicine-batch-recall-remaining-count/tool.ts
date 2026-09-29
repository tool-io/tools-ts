import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotIds: readonly string[];
  readonly quantities: readonly number[];
  readonly recalledIds: readonly string[];
};
export type Output = {
  readonly recalledQuantity: number;
  readonly unaffectedQuantity: number;
  readonly affectedIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    quantities: { type: "array", maxItems: 256, items: { type: "integer" } },
    recalledIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["lotIds", "quantities", "recalledIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recalledQuantity: { type: "integer" },
    unaffectedQuantity: { type: "integer" },
    affectedIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["recalledQuantity", "unaffectedQuantity", "affectedIndices"],
} as const;
/** Match explicit recall lot IDs against current supplied inventory quantities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotIds, quantities, recalledIds } = request;
  const compute = (): Output => {
    H.sameLength(lotIds, quantities);
    H.domain(quantities.every((x) => x >= 0));
    return {
      recalledQuantity: quantities.reduce(
        (a, x, i) => a + (recalledIds.includes(lotIds[i]) ? x : 0),
        0,
      ),
      unaffectedQuantity: quantities.reduce(
        (a, x, i) => a + (recalledIds.includes(lotIds[i]) ? 0 : x),
        0,
      ),
      affectedIndices: lotIds.flatMap((x, i) =>
        recalledIds.includes(x) ? [i] : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lotIds: ["L1", "L2", "L1"],
    quantities: [10, 20, 5],
    recalledIds: ["L1"],
  },
  output: {
    recalledQuantity: 15,
    unaffectedQuantity: 20,
    affectedIndices: [0, 2],
  },
} satisfies ToolExample<Input, Output>;
export const medicineBatchRecallRemainingCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/medicine-batch-recall-remaining-count",
    title: "Medicine Batch Recall Remaining Count Tool",
    description:
      "Match explicit recall lot IDs against current supplied inventory quantities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        quantities: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        recalledIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["lotIds", "quantities", "recalledIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recalledQuantity: { type: "integer" },
        unaffectedQuantity: { type: "integer" },
        affectedIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["recalledQuantity", "unaffectedQuantity", "affectedIndices"],
    },
    ports: {
      inputs: [
        {
          id: "lotIds",
          label: "Lot Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "quantities",
          label: "Quantities",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "recalledIds",
          label: "Recalled Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recalledQuantity",
          label: "Recalled Quantity",
          valueType: { type: "integer" },
        },
        {
          id: "unaffectedQuantity",
          label: "Unaffected Quantity",
          valueType: { type: "integer" },
        },
        {
          id: "affectedIndices",
          label: "Affected Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = medicineBatchRecallRemainingCountTool.execute;
export default medicineBatchRecallRemainingCountTool;
