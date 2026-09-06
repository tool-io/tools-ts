import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Electrolytic conservation can alter corrosion products and the object itself; shipwreck coins require provenance/material-specific professional assessment.",
        reference: "Museum archaeological-metal conservation guidance.",
        limitations:
          "No voltage, chemical recipe or universal safe recovery method; ownership and recovery permissions are separate.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Electrolytic conservation can alter corrosion products and the object itself; shipwreck coins require provenance/material-specific professional assessment.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/shipwreck-electrolysis-conservation-recovery-process-note",
  title: "Shipwreck Electrolysis Conservation Recovery Process Note",
  description:
    "Bounded offline reference: Electrolytic conservation can alter corrosion products and the object itself; shipwreck coins require provenance/material-specific professional assessment. Source: Museum archaeological-metal conservation guidance. No voltage, chemical recipe or universal safe recovery method; ownership and recovery permissions are separate. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
