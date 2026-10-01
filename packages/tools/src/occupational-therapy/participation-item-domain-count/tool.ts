import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly domainLabels: readonly string[];
  readonly included: readonly boolean[];
  readonly requestedDomain: string;
};
export type Output = { readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domainLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
    requestedDomain: { type: "string", maxLength: 8192 },
  },
  required: ["domainLabels", "included", "requestedDomain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Calculate participation item domain count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { domainLabels, included, requestedDomain } = request;
  const compute = (): Output => {
    H.sameLength(domainLabels, included);
    return {
      count: domainLabels.filter((x, i) => x === requestedDomain && included[i])
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    domainLabels: ["A", "B", "A"],
    included: [true, true, false],
    requestedDomain: "A",
  },
  output: { count: 1 },
} satisfies ToolExample<Input, Output>;
export const participationItemDomainCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/participation-item-domain-count",
    title: "Participation Item Domain Count Tool",
    description:
      "Calculate participation item domain count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domainLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
        requestedDomain: { type: "string", maxLength: 8192 },
      },
      required: ["domainLabels", "included", "requestedDomain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
    },
    ports: {
      inputs: [
        {
          id: "domainLabels",
          label: "Domain Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requestedDomain",
          label: "Requested Domain",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = participationItemDomainCountTool.execute;
export default participationItemDomainCountTool;
