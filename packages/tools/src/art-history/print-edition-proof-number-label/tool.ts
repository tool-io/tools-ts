import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  editionNumber: number;
  editionSize: number;
  proofKind: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "editionNumber", label: "Edition number", kind: "integer" },
  { id: "editionSize", label: "Edition size", kind: "integer" },
  {
    id: "proofKind",
    label: "Proof kind",
    kind: "string",
    enum: ["numbered", "AP", "PP"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.editionSize, 1, 1000000);
  H.int(i.editionNumber, 1, i.editionSize);
  H.choice(i.proofKind, ["numbered", "AP", "PP"]);
  return H.finish({
    label:
      i.proofKind === "numbered"
        ? i.editionNumber + "/" + i.editionSize
        : i.proofKind + " " + i.editionNumber + "/" + i.editionSize,
  });
};
export const example = {
  input: { editionNumber: 2, editionSize: 50, proofKind: "AP" },
  output: { result: { label: "AP 2/50" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "art-history/print-edition-proof-number-label",
  title: "Art History: Print Edition Proof Number Label Tool",
  description:
    "Format explicitly numbered ordinary, artist-proof AP or printers-proof PP editions while validating the supplied ordinal bounds; does not authenticate an edition.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" } },
        required: ["label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
