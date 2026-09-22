import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly aRow: readonly number[];
  readonly bColumn: readonly number[];
  readonly alpha: number;
  readonly rank: number;
  readonly baseWeight: number;
};
export type Output = {
  readonly update: number;
  readonly adaptedWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aRow: { type: "array", maxItems: 256, items: { type: "number" } },
    bColumn: { type: "array", maxItems: 256, items: { type: "number" } },
    alpha: { type: "number" },
    rank: { type: "integer", minimum: 1 },
    baseWeight: { type: "number" },
  },
  required: ["aRow", "bColumn", "alpha", "rank", "baseWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { update: { type: "number" }, adaptedWeight: { type: "number" } },
  required: ["update", "adaptedWeight"],
} as const;
/** One B*A inner product with alpha/rank scaling; the caller supplies the matching row and column orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { aRow, bColumn, alpha, rank, baseWeight } = request;
  const compute = (): Output => {
    H.sameLength(aRow, bColumn);
    H.integer(rank, 1);
    H.domain(aRow.length === rank);
    return {
      update: (alpha * H.dot(aRow, bColumn)) / rank,
      adaptedWeight: baseWeight + (alpha * H.dot(aRow, bColumn)) / rank,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { aRow: [1, 2], bColumn: [3, 4], alpha: 4, rank: 2, baseWeight: 10 },
  output: { update: 22, adaptedWeight: 32 },
} satisfies ToolExample<Input, Output>;
export const loraUpdateOneWeightEntryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/lora-update-one-weight-entry-term",
    title: "LoRA Update One Weight Entry Term Tool",
    description:
      "One B*A inner product with alpha/rank scaling; the caller supplies the matching row and column orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        aRow: { type: "array", maxItems: 256, items: { type: "number" } },
        bColumn: { type: "array", maxItems: 256, items: { type: "number" } },
        alpha: { type: "number" },
        rank: { type: "integer", minimum: 1 },
        baseWeight: { type: "number" },
      },
      required: ["aRow", "bColumn", "alpha", "rank", "baseWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        update: { type: "number" },
        adaptedWeight: { type: "number" },
      },
      required: ["update", "adaptedWeight"],
    },
    ports: {
      inputs: [
        {
          id: "aRow",
          label: "A Row",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "bColumn",
          label: "B Column",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rank",
          label: "Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "baseWeight",
          label: "Base Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "update", label: "Update", valueType: { type: "number" } },
        {
          id: "adaptedWeight",
          label: "Adapted Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = loraUpdateOneWeightEntryTermTool.execute;
export default loraUpdateOneWeightEntryTermTool;
