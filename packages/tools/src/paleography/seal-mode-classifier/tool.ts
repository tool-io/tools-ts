import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly observedAttachment: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedAttachment", label: "Observed attachment", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.observedAttachment,
      {
        "attached-by-cord": "pendant",
        "attached-by-parchment-strip": "pendant",
        "directly-on-document": "applied",
        unknown: "unknown",
      },
      "observedAttachment",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedAttachment: "attached-by-cord" },
  output: { result: { reference: "pendant" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleography/seal-mode-classifier",
  title: "Seal Presence Attachment Mode Classifier (pendant-applied)",
  description:
    "Map explicit seal attachment observation to pendant/applied mode, not authenticity or document date.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
