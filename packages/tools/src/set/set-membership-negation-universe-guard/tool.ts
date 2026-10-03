import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly element: string;
  readonly members: readonly string[];
  readonly universe: readonly string[];
};
export type Output = { readonly member: boolean; readonly complement: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    element: { type: "string", maxLength: 8192 },
    members: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    universe: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["element", "members", "universe"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { member: { type: "boolean" }, complement: { type: "boolean" } },
  required: ["member", "complement"],
} as const;
/** Compute set membership negation universe guard from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { element, members, universe } = input;
  const compute = (): Output => {
    domain(
      universe.includes(element),
      "element",
      "Element must belong to the supplied universe.",
    );
    domain(members.every((x) => universe.includes(x)));
    return {
      member: members.includes(element),
      complement: !members.includes(element),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { element: "b", members: ["a"], universe: ["a", "b"] },
  output: { member: false, complement: true },
} satisfies ToolExample<Input, Output>;
export const setMembershipNegationUniverseGuardTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/set-membership-negation-universe-guard",
  title: "Set Membership Negation Universe Guard Tool",
  description:
    "Compute set membership negation universe guard from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "element",
        label: "Element",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "members",
        label: "Members",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "universe",
        label: "Universe",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
    outputs: [
      { id: "member", label: "Member", valueType: { type: "boolean" } },
      { id: "complement", label: "Complement", valueType: { type: "boolean" } },
    ],
  },
});
export const run = setMembershipNegationUniverseGuardTool.execute;
export default setMembershipNegationUniverseGuardTool;
