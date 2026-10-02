import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothIds: readonly string[];
  readonly siteLabels: readonly string[];
  readonly observed: readonly boolean[];
  readonly requiredSites: readonly string[];
};
export type Output = {
  readonly expectedSites: number;
  readonly observedRequiredSites: number;
  readonly missingSites: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    siteLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    requiredSites: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["toothIds", "siteLabels", "observed", "requiredSites"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedSites: { type: "integer" },
    observedRequiredSites: { type: "integer" },
    missingSites: { type: "integer" },
  },
  required: ["expectedSites", "observedRequiredSites", "missingSites"],
} as const;
/** Calculate site grid observation gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothIds, siteLabels, observed, requiredSites } = request;
  const compute = (): Output => {
    H.sameLength(toothIds, siteLabels);
    H.sameLength(toothIds, observed);
    return (() => {
      const teeth = [...new Set(toothIds)],
        sites = [...new Set(requiredSites)],
        expectedSites = teeth.length * sites.length;
      let observedRequiredSites = 0;
      for (const t of teeth)
        for (const s of sites)
          if (
            toothIds.some(
              (x, i) => x === t && siteLabels[i] === s && observed[i],
            )
          )
            observedRequiredSites++;
      return {
        expectedSites,
        observedRequiredSites,
        missingSites: expectedSites - observedRequiredSites,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    toothIds: ["t1", "t1", "t2"],
    siteLabels: ["a", "b", "a"],
    observed: [true, false, true],
    requiredSites: ["a", "b"],
  },
  output: { expectedSites: 4, observedRequiredSites: 2, missingSites: 2 },
} satisfies ToolExample<Input, Output>;
export const siteGridObservationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/site-grid-observation-gap",
    title: "Site Grid Observation Gap Tool",
    description:
      "Calculate site grid observation gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        siteLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        requiredSites: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["toothIds", "siteLabels", "observed", "requiredSites"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedSites: { type: "integer" },
        observedRequiredSites: { type: "integer" },
        missingSites: { type: "integer" },
      },
      required: ["expectedSites", "observedRequiredSites", "missingSites"],
    },
    ports: {
      inputs: [
        {
          id: "toothIds",
          label: "Tooth Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "siteLabels",
          label: "Site Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requiredSites",
          label: "Required Sites",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "expectedSites",
          label: "Expected Sites",
          valueType: { type: "integer" },
        },
        {
          id: "observedRequiredSites",
          label: "Observed Required Sites",
          valueType: { type: "integer" },
        },
        {
          id: "missingSites",
          label: "Missing Sites",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = siteGridObservationGapTool.execute;
export default siteGridObservationGapTool;
