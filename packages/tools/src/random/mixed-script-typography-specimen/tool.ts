import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  bounded,
  aligned,
  unique,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly scriptLabels: readonly string[];
  readonly callerTextFragments: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "scriptLabels", label: "Script labels", kind: "stringList" },
  {
    id: "callerTextFragments",
    label: "Caller text fragments",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.scriptLabels, "script labels");
  aligned(input.scriptLabels, input.callerTextFragments, "script samples");
  if (input.callerTextFragments.some((v) => !v.trim()))
    simpleError("fragments", "Explicit text fragments required.");
  const specimens = Array.from(
    { length: bounded(input.count, "count", 1, 64) },
    () => {
      const order = indices(
        input.scriptLabels.length,
        {
          seed: input.seed,
          count: input.scriptLabels.length,
          withoutReplacement: true,
        },
        random,
      );
      return {
        scriptOrder: order.map((i) => input.scriptLabels[i]),
        text: order.map((i) => input.callerTextFragments[i]).join(" "),
      };
    },
  );
  return { result: { specimens } };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    scriptLabels: ["Latin", "Greek"],
    callerTextFragments: ["ABC", "\u0391\u0392\u0393"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/mixed-script-typography-specimen",
  title: "Random Mixed-Script Typography Specimen Generator",
  description:
    "Compose all caller labeled script fragments in a uniformly random order per typography specimen; preserves actual supplied Unicode rather than claiming that labels establish script/language or normalization.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
