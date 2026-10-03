import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly universe: readonly string[];
  readonly subset: readonly string[];
  readonly element: string;
};
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    subset: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    element: { type: "string", maxLength: 8192 },
  },
  required: ["universe", "subset", "element"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Calculate set membership unknown universe code from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { universe, subset, element } = request;
  const compute = (): Output => {
    const u = new Set(universe);
    H.domain(subset.every((x) => u.has(x)));
    return {
      code: !u.has(element)
        ? "outside-universe"
        : subset.includes(element)
          ? "member"
          : "nonmember",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { universe: ["a", "b"], subset: ["a"], element: "z" },
  output: { code: "outside-universe" },
} satisfies ToolExample<Input, Output>;
export const setMembershipUnknownUniverseCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-membership-unknown-universe-code",
    title: "Set Membership Unknown Universe Code Tool",
    description:
      "Calculate set membership unknown universe code from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        universe: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        subset: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        element: { type: "string", maxLength: 8192 },
      },
      required: ["universe", "subset", "element"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    ports: {
      inputs: [
        {
          id: "universe",
          label: "Universe",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "subset",
          label: "Subset",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "element",
          label: "Element",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = setMembershipUnknownUniverseCodeTool.execute;
export default setMembershipUnknownUniverseCodeTool;
