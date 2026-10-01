import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ opcode: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "opcode", label: "Opcode", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.opcode, 0, 65535);
  return H.finish({
    name:
      (
        {
          1: "ARP-request",
          2: "ARP-reply",
          3: "RARP-request",
          4: "RARP-reply",
        } as Record<number, string>
      )[i.opcode] ?? "other",
    recognizedBaseOperation: i.opcode >= 1 && i.opcode <= 4,
  });
};
export const example = {
  input: { opcode: 2 },
  output: { result: { name: "ARP-reply", recognizedBaseOperation: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/arp-opcode-single-field-label",
  title: "Network: Arp Opcode Single Field Label Tool",
  description:
    "Label the four base ARP/RARP operation codes from RFC826/RFC903 while preserving other sixteen-bit opcodes as other; not packet validation or a complete IANA registry.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          recognizedBaseOperation: { type: "boolean" },
        },
        required: ["name", "recognizedBaseOperation"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
