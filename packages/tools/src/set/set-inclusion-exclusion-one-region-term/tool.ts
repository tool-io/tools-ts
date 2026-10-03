import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionCardinality: number;
  readonly memberships: number;
};
export type Output = {
  readonly coefficient: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionCardinality: { type: "integer", minimum: 0 },
    memberships: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["regionCardinality", "memberships"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficient: { type: "integer" },
    contribution: { type: "integer" },
  },
  required: ["coefficient", "contribution"],
} as const;
/** Calculate set inclusion exclusion one region term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionCardinality, memberships } = request;
  const compute = (): Output => {
    H.integer(regionCardinality, 0);
    H.integer(memberships, 1, 128);
    const coefficient = memberships % 2 === 1 ? 1 : -1;
    return { coefficient, contribution: coefficient * regionCardinality };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regionCardinality: 5, memberships: 2 },
  output: { coefficient: -1, contribution: -5 },
} satisfies ToolExample<Input, Output>;
export const setInclusionExclusionOneRegionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-inclusion-exclusion-one-region-term",
    title: "Set Inclusion Exclusion One Region Term Tool",
    description:
      "Calculate set inclusion exclusion one region term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionCardinality: { type: "integer", minimum: 0 },
        memberships: { type: "integer", minimum: 1, maximum: 128 },
      },
      required: ["regionCardinality", "memberships"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficient: { type: "integer" },
        contribution: { type: "integer" },
      },
      required: ["coefficient", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "regionCardinality",
          label: "Region Cardinality",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "memberships",
          label: "Memberships",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "coefficient",
          label: "Coefficient",
          valueType: { type: "integer" },
        },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = setInclusionExclusionOneRegionTermTool.execute;
export default setInclusionExclusionOneRegionTermTool;
