import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: readonly boolean[];
  readonly planned: readonly boolean[];
};
export type Output = {
  readonly observedPlanned: number;
  readonly plannedCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    planned: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["observed", "planned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedPlanned: { type: "integer" },
    plannedCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["observedPlanned", "plannedCount", "share", "defined"],
} as const;
/** Count research site observation coverage without disease activity scoring. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, planned } = request;
  const compute = (): Output => {
    H.sameLength(observed, planned);
    return {
      observedPlanned: observed.filter((x, i) => x && planned[i]).length,
      plannedCount: planned.filter(Boolean).length,
      share: planned.some(Boolean)
        ? observed.filter((x, i) => x && planned[i]).length /
          planned.filter(Boolean).length
        : 0,
      defined: planned.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: [true, false], planned: [true, true] },
  output: { observedPlanned: 1, plannedCount: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const jointSiteObservationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/joint-site-observation-share",
    title: "Joint Site Observation Share Tool",
    description:
      "Count research site observation coverage without disease activity scoring.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        planned: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["observed", "planned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedPlanned: { type: "integer" },
        plannedCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["observedPlanned", "plannedCount", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "planned",
          label: "Planned",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "observedPlanned",
          label: "Observed Planned",
          valueType: { type: "integer" },
        },
        {
          id: "plannedCount",
          label: "Planned Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = jointSiteObservationShareTool.execute;
export default jointSiteObservationShareTool;
