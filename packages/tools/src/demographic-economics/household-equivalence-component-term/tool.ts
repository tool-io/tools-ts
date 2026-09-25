import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly members: number;
  readonly suppliedMemberWeight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    members: { type: "integer", minimum: 0 },
    suppliedMemberWeight: { type: "number", minimum: 0 },
  },
  required: ["members", "suppliedMemberWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Return one component of an explicitly supplied equivalence scale without selecting a jurisdictional scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { members, suppliedMemberWeight } = request;
  const compute = (): Output => {
    H.integer(members, 0);
    H.domain(suppliedMemberWeight >= 0);
    return { contribution: members * suppliedMemberWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { members: 2, suppliedMemberWeight: 0.5 },
  output: { contribution: 1 },
} satisfies ToolExample<Input, Output>;
export const householdEquivalenceComponentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/household-equivalence-component-term",
    title: "Household Equivalence Component Term Tool",
    description:
      "Return one component of an explicitly supplied equivalence scale without selecting a jurisdictional scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        members: { type: "integer", minimum: 0 },
        suppliedMemberWeight: { type: "number", minimum: 0 },
      },
      required: ["members", "suppliedMemberWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
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
          id: "suppliedMemberWeight",
          label: "Supplied Member Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdEquivalenceComponentTermTool.execute;
export default householdEquivalenceComponentTermTool;
