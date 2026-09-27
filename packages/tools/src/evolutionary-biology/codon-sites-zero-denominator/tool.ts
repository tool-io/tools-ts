import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly changes: number; readonly sites: number };
export type Output = {
  readonly defined: boolean;
  readonly changesPerSite: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changes: { type: "integer", minimum: 0 },
    sites: { type: "number", minimum: 0 },
  },
  required: ["changes", "sites"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    changesPerSite: { type: "number" },
  },
  required: ["defined", "changesPerSite"],
} as const;
/** One supplied change/site ratio with zero support flagged; no substitution model or dN/dS estimator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { changes, sites } = request;
  const compute = (): Output => {
    H.integer(changes, 0);
    H.domain(sites >= 0);
    return {
      defined: sites > 0,
      changesPerSite: sites > 0 ? changes / sites : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { changes: 0, sites: 0 },
  output: { defined: false, changesPerSite: 0 },
} satisfies ToolExample<Input, Output>;
export const codonSitesZeroDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/codon-sites-zero-denominator",
    title: "Codon Sites Zero Denominator Tool",
    description:
      "One supplied change/site ratio with zero support flagged; no substitution model or dN/dS estimator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changes: { type: "integer", minimum: 0 },
        sites: { type: "number", minimum: 0 },
      },
      required: ["changes", "sites"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        changesPerSite: { type: "number" },
      },
      required: ["defined", "changesPerSite"],
    },
    ports: {
      inputs: [
        {
          id: "changes",
          label: "Changes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sites",
          label: "Sites",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "changesPerSite",
          label: "Changes Per Site",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = codonSitesZeroDenominatorTool.execute;
export default codonSitesZeroDenominatorTool;
