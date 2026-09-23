import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDuration: number;
  readonly intendedDuration: number;
  readonly excludedDuration: number;
};
export type Output = {
  readonly eligibleDuration: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDuration: { type: "number", minimum: 0 },
    intendedDuration: { type: "number" },
    excludedDuration: { type: "number", minimum: 0 },
  },
  required: ["observedDuration", "intendedDuration", "excludedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDuration: { type: "number" },
    coverage: { type: "number" },
  },
  required: ["eligibleDuration", "coverage"],
} as const;
/** Audit supplied research collection-time coverage without inferring specimen adequacy or exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDuration, intendedDuration, excludedDuration } = request;
  const compute = (): Output => {
    H.domain(
      intendedDuration > excludedDuration &&
        excludedDuration >= 0 &&
        observedDuration >= 0 &&
        observedDuration <= intendedDuration - excludedDuration,
    );
    return {
      eligibleDuration: intendedDuration - excludedDuration,
      coverage: observedDuration / (intendedDuration - excludedDuration),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedDuration: 60, intendedDuration: 100, excludedDuration: 20 },
  output: { eligibleDuration: 80, coverage: 0.75 },
} satisfies ToolExample<Input, Output>;
export const collectionDurationCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/collection-duration-coverage-share",
    title: "Collection Duration Coverage Share Tool",
    description:
      "Audit supplied research collection-time coverage without inferring specimen adequacy or exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDuration: { type: "number", minimum: 0 },
        intendedDuration: { type: "number" },
        excludedDuration: { type: "number", minimum: 0 },
      },
      required: ["observedDuration", "intendedDuration", "excludedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDuration: { type: "number" },
        coverage: { type: "number" },
      },
      required: ["eligibleDuration", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "observedDuration",
          label: "Observed Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intendedDuration",
          label: "Intended Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedDuration",
          label: "Excluded Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleDuration",
          label: "Eligible Duration",
          valueType: { type: "number" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = collectionDurationCoverageShareTool.execute;
export default collectionDurationCoverageShareTool;
