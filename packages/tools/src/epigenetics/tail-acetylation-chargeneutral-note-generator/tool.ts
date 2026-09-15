import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ acetylatedLysines: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "acetylatedLysines", label: "Acetylated lysines", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.acetylatedLysines, "lysines", 0, 10000);
  return {
    formalPositiveChargeChange: -i.acetylatedLysines,
    assumption: "each-lysine-epsilon-amine-initially-protonated",
    transcriptionEffectEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { acetylatedLysines: 3 },
  output: {
    result: {
      formalPositiveChargeChange: -3,
      assumption: "each-lysine-epsilon-amine-initially-protonated",
      transcriptionEffectEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "epigenetics/tail-acetylation-chargeneutral-note-generator",
  title:
    "Histone Tail Acetylation Charge Neutralization Lys Count Effect Note Generator",
  description:
    "Count idealized lysine positive-charge neutralization by acetylation; no DNA-affinity or transcription prediction.",
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
