import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly missing: number;
  readonly excluded: number;
  readonly target: number;
};
export type Output = {
  readonly eligible: number;
  readonly coverage: number;
  readonly coverageDefined: boolean;
  readonly unaccounted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "integer", minimum: 0 },
    missing: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    target: { type: "integer", minimum: 0 },
  },
  required: ["observed", "missing", "excluded", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    coverage: { type: "number" },
    coverageDefined: { type: "boolean" },
    unaccounted: { type: "integer" },
  },
  required: ["eligible", "coverage", "coverageDefined", "unaccounted"],
} as const;
/** Audit disjoint supplied research joint-count categories without calculating a clinical score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, missing, excluded, target } = request;
  const compute = (): Output => {
    H.integer(target, 0);
    H.integer(observed, 0);
    H.integer(missing, 0);
    H.integer(excluded, 0);
    H.domain(observed + missing + excluded <= target);
    return {
      eligible: target - excluded,
      coverage: target > excluded ? observed / (target - excluded) : 0,
      coverageDefined: target > excluded,
      unaccounted: target - observed - missing - excluded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 20, missing: 3, excluded: 2, target: 28 },
  output: {
    eligible: 26,
    coverage: 0.7692307692307693,
    coverageDefined: true,
    unaccounted: 3,
  },
} satisfies ToolExample<Input, Output>;
export const researchJointCountCoverageBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/research-joint-count-coverage-base",
    title: "Research Joint Count Coverage Base Tool",
    description:
      "Audit disjoint supplied research joint-count categories without calculating a clinical score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "integer", minimum: 0 },
        missing: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        target: { type: "integer", minimum: 0 },
      },
      required: ["observed", "missing", "excluded", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer" },
        coverage: { type: "number" },
        coverageDefined: { type: "boolean" },
        unaccounted: { type: "integer" },
      },
      required: ["eligible", "coverage", "coverageDefined", "unaccounted"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missing",
          label: "Missing",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
        {
          id: "coverageDefined",
          label: "Coverage Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "unaccounted",
          label: "Unaccounted",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchJointCountCoverageBaseTool.execute;
export default researchJointCountCoverageBaseTool;
