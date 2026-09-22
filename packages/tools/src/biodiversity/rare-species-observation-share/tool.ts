import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly suppliedRare: readonly boolean[];
};
export type Output = {
  readonly rareCount: number;
  readonly totalCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    suppliedRare: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["counts", "suppliedRare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rareCount: { type: "integer" },
    totalCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["rareCount", "totalCount", "share", "defined"],
} as const;
/** Aggregate caller-classified rarity flags without inventing a species rarity threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, suppliedRare } = request;
  const compute = (): Output => {
    H.sameLength(counts, suppliedRare);
    H.domain(counts.every((x) => x >= 0));
    return {
      rareCount: counts.reduce((a, b, i) => a + (suppliedRare[i] ? b : 0), 0),
      totalCount: counts.reduce((a, b) => a + b, 0),
      share: counts.some((x) => x > 0)
        ? counts.reduce((a, b, i) => a + (suppliedRare[i] ? b : 0), 0) /
          counts.reduce((a, b) => a + b, 0)
        : 0,
      defined: counts.some((x) => x > 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { counts: [2, 6, 2], suppliedRare: [true, false, true] },
  output: { rareCount: 4, totalCount: 10, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const rareSpeciesObservationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/rare-species-observation-share",
    title: "Rare Species Observation Share Tool",
    description:
      "Aggregate caller-classified rarity flags without inventing a species rarity threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        suppliedRare: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["counts", "suppliedRare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rareCount: { type: "integer" },
        totalCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["rareCount", "totalCount", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "counts",
          label: "Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "suppliedRare",
          label: "Supplied Rare",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "rareCount",
          label: "Rare Count",
          valueType: { type: "integer" },
        },
        {
          id: "totalCount",
          label: "Total Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = rareSpeciesObservationShareTool.execute;
export default rareSpeciesObservationShareTool;
