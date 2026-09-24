import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  correct: number;
  attempted: number;
  abstained: number;
  denominatorPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "correct", label: "Correct", kind: "integer" },
  { id: "attempted", label: "Attempted", kind: "integer" },
  { id: "abstained", label: "Abstained", kind: "integer" },
  {
    id: "denominatorPolicy",
    label: "Denominator policy",
    kind: "string",
    enum: ["include-abstentions", "exclude-abstentions"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.correct, i.attempted, i.abstained].forEach((x) => H.int(x, 0, 1000000));
  H.check(i.correct <= i.attempted);
  H.choice(i.denominatorPolicy, ["include-abstentions", "exclude-abstentions"]);
  const denominator =
    i.attempted +
    (i.denominatorPolicy === "include-abstentions" ? i.abstained : 0);
  return H.finish({
    denominator,
    defined: denominator > 0,
    accuracy: denominator > 0 ? i.correct / denominator : 0,
  });
};
export const example = {
  input: {
    correct: 6,
    attempted: 8,
    abstained: 2,
    denominatorPolicy: "include-abstentions",
  },
  output: { result: { denominator: 10, defined: true, accuracy: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/abstention-correct-denominator",
  title: "Classification: Abstention Correct Denominator Tool",
  description:
    "Compute accuracy under an explicit include/exclude-abstention denominator, with attempted counts excluding abstentions and undefined status retained.",
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
          accuracy: { type: "number" },
          defined: { type: "boolean" },
          denominator: { type: "number" },
        },
        required: ["accuracy", "defined", "denominator"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
