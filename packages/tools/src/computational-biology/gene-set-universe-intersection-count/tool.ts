import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly geneIds: readonly string[];
  readonly universeIds: readonly string[];
};
export type Output = {
  readonly insideUniverse: number;
  readonly outsideUniverse: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geneIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    universeIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["geneIds", "universeIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideUniverse: { type: "integer" },
    outsideUniverse: { type: "integer" },
  },
  required: ["insideUniverse", "outsideUniverse"],
} as const;
/** Count distinct exact supplied identifiers; no gene alias database is consulted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { geneIds, universeIds } = request;
  const compute = (): Output => {
    return {
      insideUniverse: new Set(geneIds.filter((x) => universeIds.includes(x)))
        .size,
      outsideUniverse: new Set(geneIds.filter((x) => !universeIds.includes(x)))
        .size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { geneIds: ["a", "b", "b", "c"], universeIds: ["b", "c", "d"] },
  output: { insideUniverse: 2, outsideUniverse: 1 },
} satisfies ToolExample<Input, Output>;
export const geneSetUniverseIntersectionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/gene-set-universe-intersection-count",
    title: "Gene Set Universe Intersection Count Tool",
    description:
      "Count distinct exact supplied identifiers; no gene alias database is consulted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        geneIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        universeIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["geneIds", "universeIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insideUniverse: { type: "integer" },
        outsideUniverse: { type: "integer" },
      },
      required: ["insideUniverse", "outsideUniverse"],
    },
    ports: {
      inputs: [
        {
          id: "geneIds",
          label: "Gene Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "universeIds",
          label: "Universe Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "insideUniverse",
          label: "Inside Universe",
          valueType: { type: "integer" },
        },
        {
          id: "outsideUniverse",
          label: "Outside Universe",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = geneSetUniverseIntersectionCountTool.execute;
export default geneSetUniverseIntersectionCountTool;
