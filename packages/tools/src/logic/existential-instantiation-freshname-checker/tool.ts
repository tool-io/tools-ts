import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, identifier } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly proposedConstant: string;
  readonly usedConstants: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "proposedConstant", label: "Proposed constant", kind: "string" },
  { id: "usedConstants", label: "Used constants", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  identifier(i.proposedConstant);
  i.usedConstants.forEach(identifier);
  return {
    freshAgainstDeclaredContext: !i.usedConstants.includes(i.proposedConstant),
    fullExistentialEliminationVerified: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { proposedConstant: "a", usedConstants: ["b"] },
  output: {
    result: {
      freshAgainstDeclaredContext: true,
      fullExistentialEliminationVerified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/existential-instantiation-freshname-checker",
  title: "Existential Instantiation EI Fresh Name Constraint Checker",
  description:
    "Fresh witness-name check against explicit full caller constant inventory; scope/discharge and full existential-elimination side conditions not verified.",
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
          freshAgainstDeclaredContext: { type: "boolean" },
          fullExistentialEliminationVerified: { type: "boolean" },
        },
        required: [
          "freshAgainstDeclaredContext",
          "fullExistentialEliminationVerified",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
