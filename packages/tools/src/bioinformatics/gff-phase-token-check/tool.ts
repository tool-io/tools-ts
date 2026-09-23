import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string", enum: ["0", "1", "2", "."] },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.token, ["0", "1", "2", "."]);
  return H.finish({
    known: i.token !== ".",
    phase: i.token === "." ? -1 : Number(i.token),
  });
};
export const example = {
  input: { token: "." },
  output: { result: { known: false, phase: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bioinformatics/gff-phase-token-check",
  title: "Bioinformatics: GFF Phase Token Check Tool",
  description:
    "Parse one GFF3 phase token 0/1/2 or unknown dot, retaining unknown status; does not infer CDS frame or validate an entire feature.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { known: { type: "boolean" }, phase: { type: "number" } },
        required: ["known", "phase"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
