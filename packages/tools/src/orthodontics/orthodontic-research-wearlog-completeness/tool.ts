import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: readonly boolean[];
  readonly observed: readonly boolean[];
  readonly worn: readonly boolean[];
};
export type Output = {
  readonly opportunities: number;
  readonly observedOpportunities: number;
  readonly observedWorn: number;
  readonly completeness: number;
  readonly wearAmongObserved: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    worn: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["scheduled", "observed", "worn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunities: { type: "integer" },
    observedOpportunities: { type: "integer" },
    observedWorn: { type: "integer" },
    completeness: { type: "number" },
    wearAmongObserved: { type: "number" },
  },
  required: [
    "opportunities",
    "observedOpportunities",
    "observedWorn",
    "completeness",
    "wearAmongObserved",
  ],
} as const;
/** Separate observation completeness from recorded wear among observed opportunities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduled, observed, worn } = request;
  const compute = (): Output => {
    H.sameLength(scheduled, observed);
    H.sameLength(scheduled, worn);
    const opportunities = scheduled.filter(Boolean).length,
      observedOpportunities = scheduled.filter(
        (v, i) => v && observed[i],
      ).length,
      observedWorn = scheduled.filter(
        (v, i) => v && observed[i] && worn[i],
      ).length;
    H.domain(opportunities > 0 && observedOpportunities > 0, "observed");
    return {
      opportunities,
      observedOpportunities,
      observedWorn,
      completeness: observedOpportunities / opportunities,
      wearAmongObserved: observedWorn / observedOpportunities,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduled: [true, true, true, false],
    observed: [true, true, false, true],
    worn: [true, false, true, true],
  },
  output: {
    opportunities: 3,
    observedOpportunities: 2,
    observedWorn: 1,
    completeness: 0.6666666666666666,
    wearAmongObserved: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const orthodonticResearchWearlogCompletenessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "orthodontics/orthodontic-research-wearlog-completeness",
      title: "Orthodontic Research Wearlog Completeness Tool",
      description:
        "Separate observation completeness from recorded wear among observed opportunities.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scheduled: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          observed: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          worn: { type: "array", maxItems: 256, items: { type: "boolean" } },
        },
        required: ["scheduled", "observed", "worn"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opportunities: { type: "integer" },
          observedOpportunities: { type: "integer" },
          observedWorn: { type: "integer" },
          completeness: { type: "number" },
          wearAmongObserved: { type: "number" },
        },
        required: [
          "opportunities",
          "observedOpportunities",
          "observedWorn",
          "completeness",
          "wearAmongObserved",
        ],
      },
      ports: {
        inputs: [
          {
            id: "scheduled",
            label: "Scheduled",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "worn",
            label: "Worn",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "opportunities",
            label: "Opportunities",
            valueType: { type: "integer" },
          },
          {
            id: "observedOpportunities",
            label: "Observed Opportunities",
            valueType: { type: "integer" },
          },
          {
            id: "observedWorn",
            label: "Observed Worn",
            valueType: { type: "integer" },
          },
          {
            id: "completeness",
            label: "Completeness",
            valueType: { type: "number" },
          },
          {
            id: "wearAmongObserved",
            label: "Wear Among Observed",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = orthodonticResearchWearlogCompletenessTool.execute;
export default orthodonticResearchWearlogCompletenessTool;
