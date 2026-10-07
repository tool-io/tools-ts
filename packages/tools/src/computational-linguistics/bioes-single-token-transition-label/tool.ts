import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousTag: string;
  readonly currentTag: string;
};
export type Output = { readonly validLocalTransition: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousTag: { type: "string", maxLength: 8192 },
    currentTag: { type: "string", maxLength: 8192 },
  },
  required: ["previousTag", "currentTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { validLocalTransition: { type: "boolean" } },
  required: ["validLocalTransition"],
} as const;
/** Check one local BIOES transition under an explicit strict span-closing convention, excluding sentence boundary validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousTag, currentTag } = request;
  const compute = (): Output => {
    return (() => {
      const parse = (tag: string, field: string) => {
        H.domain(
          /^(?:O|[BIES]-.+)(?![\s\S])/.test(tag) && !/[\r\n]/.test(tag),
          field,
        );
        return {
          prefix: tag === "O" ? "O" : tag[0],
          type: tag === "O" ? "" : tag.slice(2),
        };
      };
      const a = parse(previousTag, "previousTag"),
        b = parse(currentTag, "currentTag");
      return {
        validLocalTransition:
          a.prefix === "B" || a.prefix === "I"
            ? (b.prefix === "I" || b.prefix === "E") && a.type === b.type
            : b.prefix === "O" || b.prefix === "B" || b.prefix === "S",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousTag: "B-PER", currentTag: "E-PER" },
  output: { validLocalTransition: true },
} satisfies ToolExample<Input, Output>;
export const bioesSingleTokenTransitionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/bioes-single-token-transition-label",
    title: "BIOES Single Token Transition Label",
    description:
      "Check one local BIOES transition under an explicit strict span-closing convention, excluding sentence boundary validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousTag: { type: "string", maxLength: 8192 },
        currentTag: { type: "string", maxLength: 8192 },
      },
      required: ["previousTag", "currentTag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { validLocalTransition: { type: "boolean" } },
      required: ["validLocalTransition"],
    },
    ports: {
      inputs: [
        {
          id: "previousTag",
          label: "Previous Tag",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentTag",
          label: "Current Tag",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "validLocalTransition",
          label: "Valid Local Transition",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioesSingleTokenTransitionLabelTool.execute;
export default bioesSingleTokenTransitionLabelTool;
