import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly itemCount: number;
  readonly callerObservedAppositiveAmbiguity: boolean;
  readonly callerObservedCompoundItemAmbiguity: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "itemCount", label: "Item count", kind: "number" },
  {
    id: "callerObservedAppositiveAmbiguity",
    label: "Caller observed appositive ambiguity",
    kind: "boolean",
  },
  {
    id: "callerObservedCompoundItemAmbiguity",
    label: "Caller observed compound item ambiguity",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.itemCount, "items", 0, 1000000);
  return {
    callerAmbiguityReview:
      i.itemCount >= 3 &&
      (i.callerObservedAppositiveAmbiguity ||
        i.callerObservedCompoundItemAmbiguity),
    textAmbiguityDetectedAutomatically: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    itemCount: 3,
    callerObservedAppositiveAmbiguity: true,
    callerObservedCompoundItemAmbiguity: false,
  },
  output: {
    result: {
      callerAmbiguityReview: true,
      textAmbiguityDetectedAutomatically: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/oxford-comma-list-ambiguity-trigger-checker",
  title: "Oxford Comma List Ambiguity Trigger Checker",
  description:
    "Review flag from explicit editor-observed apposition/compound ambiguity in >=3-item lists; does not parse text or mandate a universal serial-comma style.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          callerAmbiguityReview: { type: "boolean" },
          textAmbiguityDetectedAutomatically: { type: "boolean" },
        },
        required: [
          "callerAmbiguityReview",
          "textAmbiguityDetectedAutomatically",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
