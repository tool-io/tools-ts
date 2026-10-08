import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sources: readonly number[];
  readonly uses: readonly number[];
};
export type Output = {
  readonly totalSources: number;
  readonly totalUses: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sources: { type: "array", maxItems: 256, items: { type: "number" } },
    uses: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["sources", "uses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSources: { type: "number" },
    totalUses: { type: "number" },
    residual: { type: "number" },
  },
  required: ["totalSources", "totalUses", "residual"],
} as const;
/** Reconcile explicit acquisition financing sources and uses in one common currency without inferring financing structure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sources, uses } = request;
  const compute = (): Output => {
    sources.forEach((v) => H.domain(v >= 0, "sources"));
    uses.forEach((v) => H.domain(v >= 0, "uses"));
    const totalSources = sources.reduce((a, b) => a + b, 0),
      totalUses = uses.reduce((a, b) => a + b, 0);
    return { totalSources, totalUses, residual: totalSources - totalUses };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sources: [500, 300], uses: [650, 100] },
  output: { totalSources: 800, totalUses: 750, residual: 50 },
} satisfies ToolExample<Input, Output>;
export const acquisitionSourcesUsesResidualTool = H.defineSchemaCalculation<
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
    id: "corporate-finance/acquisition-sources-uses-residual",
    title: "Acquisition Sources Uses Residual",
    description:
      "Reconcile explicit acquisition financing sources and uses in one common currency without inferring financing structure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sources: { type: "array", maxItems: 256, items: { type: "number" } },
        uses: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["sources", "uses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSources: { type: "number" },
        totalUses: { type: "number" },
        residual: { type: "number" },
      },
      required: ["totalSources", "totalUses", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "sources",
          label: "Sources",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "uses",
          label: "Uses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "totalSources",
          label: "Total Sources",
          valueType: { type: "number" },
        },
        { id: "totalUses", label: "Total Uses", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = acquisitionSourcesUsesResidualTool.execute;
export default acquisitionSourcesUsesResidualTool;
