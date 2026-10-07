import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly emptyNodeId: string };
export type Output = {
  readonly anchorWordId: number;
  readonly suffixText: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { emptyNodeId: { type: "string", maxLength: 8192 } },
  required: ["emptyNodeId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchorWordId: { type: "integer" },
    suffixText: { type: "string", maxLength: 8192 },
  },
  required: ["anchorWordId", "suffixText"],
} as const;
/** Split a CoNLL-U empty-node ID without parsing its dot suffix as a fractional decimal or checking sentence-order constraints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emptyNodeId } = request;
  const compute = (): Output => {
    return (() => {
      const match = /^(0|[1-9][0-9]*)[.]([1-9][0-9]*)(?![\s\S])/.exec(
        emptyNodeId,
      );
      H.domain(match !== null, "emptyNodeId");
      const anchorWordId = Number(match[1]);
      H.domain(Number.isSafeInteger(anchorWordId), "emptyNodeId");
      return { anchorWordId, suffixText: match[2] };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { emptyNodeId: "4.10" },
  output: { anchorWordId: 4, suffixText: "10" },
} satisfies ToolExample<Input, Output>;
export const conlluDecimalEmptyNodeKeyTool = H.defineSchemaCalculation<
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
    id: "computational-linguistics/conllu-decimal-empty-node-key",
    title: "CoNLL-U Decimal Empty Node Key",
    description:
      "Split a CoNLL-U empty-node ID without parsing its dot suffix as a fractional decimal or checking sentence-order constraints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { emptyNodeId: { type: "string", maxLength: 8192 } },
      required: ["emptyNodeId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchorWordId: { type: "integer" },
        suffixText: { type: "string", maxLength: 8192 },
      },
      required: ["anchorWordId", "suffixText"],
    },
    ports: {
      inputs: [
        {
          id: "emptyNodeId",
          label: "Empty Node Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "anchorWordId",
          label: "Anchor Word Id",
          valueType: { type: "integer" },
        },
        {
          id: "suffixText",
          label: "Suffix Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = conlluDecimalEmptyNodeKeyTool.execute;
export default conlluDecimalEmptyNodeKeyTool;
