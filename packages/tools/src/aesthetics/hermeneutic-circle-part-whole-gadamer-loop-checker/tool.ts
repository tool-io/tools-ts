import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerInterpretationStages: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerInterpretationStages",
    label: "Caller interpretation stages",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.callerInterpretationStages.length ||
    input.callerInterpretationStages.some((v) => !["part", "whole"].includes(v))
  )
    simpleError(
      "stages",
      "Explicit independently annotated part/whole interpretive stages.",
    );
  const a = input.callerInterpretationStages.flatMap((v, i) =>
      i && v === "whole" && input.callerInterpretationStages[i - 1] === "part"
        ? [i]
        : [],
    ),
    b = input.callerInterpretationStages.flatMap((v, i) =>
      i && v === "part" && input.callerInterpretationStages[i - 1] === "whole"
        ? [i]
        : [],
    );
  return {
    partToWholeTransitionIndices: a,
    wholeToPartTransitionIndices: b,
    oneCompleteReturnWitnessed:
      a.some((i) => b.some((k) => k > i)) ||
      b.some((i) => a.some((k) => k > i)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerInterpretationStages: ["part", "whole", "part", "whole"] },
  output: {
    result: {
      partToWholeTransitionIndices: [1, 3],
      wholeToPartTransitionIndices: [2],
      oneCompleteReturnWitnessed: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/hermeneutic-circle-part-whole-gadamer-loop-checker",
  title: "Hermeneutic Circle Part Whole Gadamer Loop Checker",
  description:
    "Audit actual caller part/whole interpretive revisits inspired by the hermeneutic circle, not logical circularity detection or validated interpretation. Gadamer, Truth and Method.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
