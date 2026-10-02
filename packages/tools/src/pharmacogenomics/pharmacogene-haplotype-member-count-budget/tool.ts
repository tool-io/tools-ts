import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly members: number;
  readonly required: number;
  readonly optional: number;
  readonly excluded: number;
};
export type Output = {
  readonly eligible: number;
  readonly requiredGap: number;
  readonly optionalCapacity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    members: { type: "integer", minimum: 0 },
    required: { type: "integer", minimum: 0 },
    optional: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
  },
  required: ["members", "required", "optional", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    requiredGap: { type: "integer" },
    optionalCapacity: { type: "integer" },
  },
  required: ["eligible", "requiredGap", "optionalCapacity"],
} as const;
/** Calculate pharmacogene haplotype member count budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { members, required, optional, excluded } = request;
  const compute = (): Output => {
    H.integer(members, 0);
    H.integer(required, 0);
    H.integer(optional, 0);
    H.integer(excluded, 0, members);
    return {
      eligible: members - excluded,
      requiredGap: members - excluded - required,
      optionalCapacity: Math.max(0, members - excluded - required - optional),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { members: 12, required: 5, optional: 3, excluded: 2 },
  output: { eligible: 10, requiredGap: 5, optionalCapacity: 2 },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneHaplotypeMemberCountBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogene-haplotype-member-count-budget",
      title: "Pharmacogene Haplotype Member Count Budget Tool",
      description:
        "Calculate pharmacogene haplotype member count budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          members: { type: "integer", minimum: 0 },
          required: { type: "integer", minimum: 0 },
          optional: { type: "integer", minimum: 0 },
          excluded: { type: "integer", minimum: 0 },
        },
        required: ["members", "required", "optional", "excluded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligible: { type: "integer" },
          requiredGap: { type: "integer" },
          optionalCapacity: { type: "integer" },
        },
        required: ["eligible", "requiredGap", "optionalCapacity"],
      },
      ports: {
        inputs: [
          {
            id: "members",
            label: "Members",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "required",
            label: "Required",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "optional",
            label: "Optional",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
          {
            id: "requiredGap",
            label: "Required Gap",
            valueType: { type: "integer" },
          },
          {
            id: "optionalCapacity",
            label: "Optional Capacity",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogeneHaplotypeMemberCountBudgetTool.execute;
export default pharmacogeneHaplotypeMemberCountBudgetTool;
