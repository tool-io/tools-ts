import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  beforeIrLengthBp: number;
  afterIrLengthBp: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "beforeIrLengthBp", label: "Before ir length bp", kind: "number" },
  { id: "afterIrLengthBp", label: "After ir length bp", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.beforeIrLengthBp, "before", 0, 1e9);
  bounded(i.afterIrLengthBp, "after", 0, 1e9);
  const change = i.afterIrLengthBp - i.beforeIrLengthBp;
  return {
    signedLengthChangeBp: change,
    event: change > 0 ? "expansion" : change < 0 ? "contraction" : "unchanged",
    homologyEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { beforeIrLengthBp: 100, afterIrLengthBp: 120 },
  output: {
    result: {
      signedLengthChangeBp: 20,
      event: "expansion",
      homologyEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/plastid-ir-shift-event-note-generator",
  title:
    "Plastid IR Inverted Repeat Contraction Expansion Event Note Generator",
  description:
    "Record IR length change from independently homologized plastid boundaries; does not establish evolutionary event homology.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
