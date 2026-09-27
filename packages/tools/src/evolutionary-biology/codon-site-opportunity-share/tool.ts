import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opportunities: readonly number[];
  readonly callableSites: readonly boolean[];
  readonly selectedSite: number;
};
export type Output = {
  readonly callableOpportunity: number;
  readonly selectedOpportunity: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunities: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    callableSites: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedSite: { type: "integer", minimum: 0, maximum: 2 },
  },
  required: ["opportunities", "callableSites", "selectedSite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callableOpportunity: { type: "number" },
    selectedOpportunity: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["callableOpportunity", "selectedOpportunity", "share", "defined"],
} as const;
/** Normalize precomputed codon-site opportunities over explicit callable sites; no genetic code or mutation model is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opportunities, callableSites, selectedSite } = request;
  const compute = (): Output => {
    H.domain(
      opportunities.length === 3 &&
        callableSites.length === 3 &&
        opportunities.every((x) => x >= 0),
    );
    H.integer(selectedSite, 0, 2);
    return (() => {
      const callableOpportunity = opportunities.reduce(
          (s, x, i) => s + (callableSites[i] ? x : 0),
          0,
        ),
        selectedOpportunity = callableSites[selectedSite]
          ? opportunities[selectedSite]
          : 0;
      return {
        callableOpportunity,
        selectedOpportunity,
        share:
          callableOpportunity > 0
            ? selectedOpportunity / callableOpportunity
            : 0,
        defined: callableOpportunity > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opportunities: [0.5, 1, 0.5],
    callableSites: [true, true, false],
    selectedSite: 0,
  },
  output: {
    callableOpportunity: 1.5,
    selectedOpportunity: 0.5,
    share: 0.3333333333333333,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const codonSiteOpportunityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/codon-site-opportunity-share",
    title: "Codon Site Opportunity Share Tool",
    description:
      "Normalize precomputed codon-site opportunities over explicit callable sites; no genetic code or mutation model is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opportunities: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        callableSites: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        selectedSite: { type: "integer", minimum: 0, maximum: 2 },
      },
      required: ["opportunities", "callableSites", "selectedSite"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        callableOpportunity: { type: "number" },
        selectedOpportunity: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "callableOpportunity",
        "selectedOpportunity",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "opportunities",
          label: "Opportunities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "callableSites",
          label: "Callable Sites",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedSite",
          label: "Selected Site",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "callableOpportunity",
          label: "Callable Opportunity",
          valueType: { type: "number" },
        },
        {
          id: "selectedOpportunity",
          label: "Selected Opportunity",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = codonSiteOpportunityShareTool.execute;
export default codonSiteOpportunityShareTool;
