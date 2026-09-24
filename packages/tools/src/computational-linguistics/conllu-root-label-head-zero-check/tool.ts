import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly head: number; readonly relation: string };
export type Output = {
  readonly rootLabel: boolean;
  readonly zeroHead: boolean;
  readonly agrees: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    head: { type: "integer", minimum: 0 },
    relation: { type: "string", maxLength: 8192 },
  },
  required: ["head", "relation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rootLabel: { type: "boolean" },
    zeroHead: { type: "boolean" },
    agrees: { type: "boolean" },
  },
  required: ["rootLabel", "zeroHead", "agrees"],
} as const;
/** Check a parsed CoNLL-U dependency label/head pair; does not validate an entire dependency tree. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { head, relation } = request;
  const compute = (): Output => {
    H.integer(head, 0);
    return {
      rootLabel: relation === "root",
      zeroHead: head === 0,
      agrees: (relation === "root") === (head === 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { head: 0, relation: "root" },
  output: { rootLabel: true, zeroHead: true, agrees: true },
} satisfies ToolExample<Input, Output>;
export const conlluRootLabelHeadZeroCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/conllu-root-label-head-zero-check",
    title: "CoNLL-U Root Label Head Zero Check Tool",
    description:
      "Check a parsed CoNLL-U dependency label/head pair; does not validate an entire dependency tree.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        head: { type: "integer", minimum: 0 },
        relation: { type: "string", maxLength: 8192 },
      },
      required: ["head", "relation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rootLabel: { type: "boolean" },
        zeroHead: { type: "boolean" },
        agrees: { type: "boolean" },
      },
      required: ["rootLabel", "zeroHead", "agrees"],
    },
    ports: {
      inputs: [
        {
          id: "head",
          label: "Head",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "relation",
          label: "Relation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "rootLabel",
          label: "Root Label",
          valueType: { type: "boolean" },
        },
        { id: "zeroHead", label: "Zero Head", valueType: { type: "boolean" } },
        { id: "agrees", label: "Agrees", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = conlluRootLabelHeadZeroCheckTool.execute;
export default conlluRootLabelHeadZeroCheckTool;
