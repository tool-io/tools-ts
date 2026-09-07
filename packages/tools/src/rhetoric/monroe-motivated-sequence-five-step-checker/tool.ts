import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedStages: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedStages",
    label: "Independently annotated stages",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const expected = [
    "attention",
    "need",
    "satisfaction",
    "visualization",
    "action",
  ];
  if (input.independentlyAnnotatedStages.some((v) => !expected.includes(v)))
    simpleError(
      "stage",
      "Explicit known Monroe stage labels, not arbitrary phrase classification.",
    );
  const missing = expected.filter(
    (v) => !input.independentlyAnnotatedStages.includes(v),
  );
  const indices = input.independentlyAnnotatedStages.map((v) =>
      expected.indexOf(v),
    ),
    k = indices.findIndex((v, i) => i > 0 && v < indices[i - 1]);
  return { missingStages: missing, firstOutOfOrderIndex: k };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedStages: [
      "attention",
      "need",
      "satisfaction",
      "visualization",
      "action",
    ],
  },
  output: { result: { missingStages: [], firstOutOfOrderIndex: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/monroe-motivated-sequence-five-step-checker",
  title: "Monroe Motivated Sequence Five Step Checker",
  description:
    "Audit independently annotated Monroe stages for missing phases and descending order; repeated phases allowed, not proof of persuasive efficacy.",
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
