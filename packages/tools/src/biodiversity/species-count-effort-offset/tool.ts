import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedTaxa: number;
  readonly effort: number;
  readonly suppliedReferenceEffort: number;
};
export type Output = {
  readonly effortRatio: number;
  readonly countPerEffort: number;
  readonly logEffortOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedTaxa: { type: "integer", minimum: 0 },
    effort: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceEffort: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedTaxa", "effort", "suppliedReferenceEffort"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effortRatio: { type: "number" },
    countPerEffort: { type: "number" },
    logEffortOffset: { type: "number" },
  },
  required: ["effortRatio", "countPerEffort", "logEffortOffset"],
} as const;
/** Express supplied survey effort and observation density without assuming richness scales linearly with effort. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedTaxa, effort, suppliedReferenceEffort } = request;
  const compute = (): Output => {
    H.integer(observedTaxa, 0);
    H.positive(effort);
    H.positive(suppliedReferenceEffort);
    return {
      effortRatio: effort / suppliedReferenceEffort,
      countPerEffort: observedTaxa / effort,
      logEffortOffset: Math.log(effort / suppliedReferenceEffort),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedTaxa: 12, effort: 4, suppliedReferenceEffort: 2 },
  output: {
    effortRatio: 2,
    countPerEffort: 3,
    logEffortOffset: 0.6931471805599453,
  },
} satisfies ToolExample<Input, Output>;
export const speciesCountEffortOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/species-count-effort-offset",
    title: "Species Count Effort Offset Tool",
    description:
      "Express supplied survey effort and observation density without assuming richness scales linearly with effort.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedTaxa: { type: "integer", minimum: 0 },
        effort: { type: "number", exclusiveMinimum: 0 },
        suppliedReferenceEffort: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedTaxa", "effort", "suppliedReferenceEffort"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effortRatio: { type: "number" },
        countPerEffort: { type: "number" },
        logEffortOffset: { type: "number" },
      },
      required: ["effortRatio", "countPerEffort", "logEffortOffset"],
    },
    ports: {
      inputs: [
        {
          id: "observedTaxa",
          label: "Observed Taxa",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effort",
          label: "Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceEffort",
          label: "Supplied Reference Effort",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effortRatio",
          label: "Effort Ratio",
          valueType: { type: "number" },
        },
        {
          id: "countPerEffort",
          label: "Count Per Effort",
          valueType: { type: "number" },
        },
        {
          id: "logEffortOffset",
          label: "Log Effort Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speciesCountEffortOffsetTool.execute;
export default speciesCountEffortOffsetTool;
