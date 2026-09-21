import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly observed: number; readonly eligible: number };
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "integer", minimum: 0 },
    eligible: { type: "integer", minimum: 0 },
  },
  required: ["observed", "eligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate tree cohort observation share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, eligible } = request;
  const compute = (): Output => {
    H.integer(eligible, 0);
    H.integer(observed, 0, eligible);
    return {
      share: eligible > 0 ? observed / eligible : 0,
      defined: eligible > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 80, eligible: 100 },
  output: { share: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const treeCohortObservationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-cohort-observation-share",
    title: "Tree Cohort Observation Share Tool",
    description:
      "Calculate tree cohort observation share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "integer", minimum: 0 },
        eligible: { type: "integer", minimum: 0 },
      },
      required: ["observed", "eligible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
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
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = treeCohortObservationShareTool.execute;
export default treeCohortObservationShareTool;
