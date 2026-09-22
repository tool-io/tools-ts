import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labels: readonly string[];
  readonly taxonIds: readonly string[];
};
export type Output = { readonly collidingLabels: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    taxonIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["labels", "taxonIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { collidingLabels: { type: "integer" } },
  required: ["collidingLabels"],
} as const;
/** Count exact labels linked to multiple supplied taxon IDs without taxonomic resolution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labels, taxonIds } = request;
  const compute = (): Output => {
    H.sameLength(labels, taxonIds);
    const map = new Map<string, Set<string>>();
    for (let i = 0; i < labels.length; i++) {
      const group = map.get(labels[i]) ?? new Set<string>();
      group.add(taxonIds[i]);
      map.set(labels[i], group);
    }
    return {
      collidingLabels: [...map.values()].filter((x) => x.size > 1).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labels: ["a", "a", "b"], taxonIds: ["t1", "t2", "t3"] },
  output: { collidingLabels: 1 },
} satisfies ToolExample<Input, Output>;
export const taxonLabelCollisionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/taxon-label-collision-count",
    title: "Taxon Label Collision Count Tool",
    description:
      "Count exact labels linked to multiple supplied taxon IDs without taxonomic resolution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        taxonIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["labels", "taxonIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { collidingLabels: { type: "integer" } },
      required: ["collidingLabels"],
    },
    ports: {
      inputs: [
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "taxonIds",
          label: "Taxon Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "collidingLabels",
          label: "Colliding Labels",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonLabelCollisionCountTool.execute;
export default taxonLabelCollisionCountTool;
