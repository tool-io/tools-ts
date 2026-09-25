import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly group: string;
  readonly foldGroups: readonly string[];
};
export type Output = { readonly inFold: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    group: { type: "string", maxLength: 8192 },
    foldGroups: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["group", "foldGroups"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inFold: { type: "boolean" } },
  required: ["inFold"],
} as const;
/** Calculate fold group membership bit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { group, foldGroups } = request;
  const compute = (): Output => {
    return { inFold: foldGroups.includes(group) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { group: "G2", foldGroups: ["G1", "G2"] },
  output: { inFold: true },
} satisfies ToolExample<Input, Output>;
export const foldGroupMembershipBitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/fold-group-membership-bit",
    title: "Fold Group Membership Bit Tool",
    description:
      "Calculate fold group membership bit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        group: { type: "string", maxLength: 8192 },
        foldGroups: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["group", "foldGroups"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inFold: { type: "boolean" } },
      required: ["inFold"],
    },
    ports: {
      inputs: [
        {
          id: "group",
          label: "Group",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "foldGroups",
          label: "Fold Groups",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "inFold", label: "In Fold", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = foldGroupMembershipBitTool.execute;
export default foldGroupMembershipBitTool;
