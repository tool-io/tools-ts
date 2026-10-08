import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedCount: number;
  readonly suppliedEffort: number;
  readonly referenceEffort: number;
};
export type Output = {
  readonly countPerEffort: number;
  readonly countPerReferenceEffort: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedCount: { type: "integer", minimum: 0 },
    suppliedEffort: { type: "number", exclusiveMinimum: 0 },
    referenceEffort: { type: "number", minimum: 0 },
  },
  required: ["observedCount", "suppliedEffort", "referenceEffort"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countPerEffort: { type: "number" },
    countPerReferenceEffort: { type: "number" },
  },
  required: ["countPerEffort", "countPerReferenceEffort"],
} as const;
/** Normalize an explicit ecological count by compatible observed effort without correcting detectability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedCount, suppliedEffort, referenceEffort } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(observedCount) &&
        observedCount >= 0 &&
        observedCount <= Number.MAX_SAFE_INTEGER,
      "observedCount",
    ),
      observedCount);
    (H.domain(suppliedEffort > 0, "suppliedEffort"), suppliedEffort);
    H.domain(referenceEffort >= 0, "referenceEffort");
    return {
      countPerEffort: observedCount / suppliedEffort,
      countPerReferenceEffort:
        (observedCount / suppliedEffort) * referenceEffort,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedCount: 30, suppliedEffort: 6, referenceEffort: 10 },
  output: { countPerEffort: 5, countPerReferenceEffort: 50 },
} satisfies ToolExample<Input, Output>;
export const ecologicalEffortNormalizedCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ecology", "biology"],
      keywords: ["ecology", "biology"],
    },
    id: "ecology/ecological-effort-normalized-count",
    title: "Ecological Effort Normalized Count",
    description:
      "Normalize an explicit ecological count by compatible observed effort without correcting detectability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedCount: { type: "integer", minimum: 0 },
        suppliedEffort: { type: "number", exclusiveMinimum: 0 },
        referenceEffort: { type: "number", minimum: 0 },
      },
      required: ["observedCount", "suppliedEffort", "referenceEffort"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countPerEffort: { type: "number" },
        countPerReferenceEffort: { type: "number" },
      },
      required: ["countPerEffort", "countPerReferenceEffort"],
    },
    ports: {
      inputs: [
        {
          id: "observedCount",
          label: "Observed Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedEffort",
          label: "Supplied Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEffort",
          label: "Reference Effort",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countPerEffort",
          label: "Count Per Effort",
          valueType: { type: "number" },
        },
        {
          id: "countPerReferenceEffort",
          label: "Count Per Reference Effort",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecologicalEffortNormalizedCountTool.execute;
export default ecologicalEffortNormalizedCountTool;
