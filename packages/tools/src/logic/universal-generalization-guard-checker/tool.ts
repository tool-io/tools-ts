import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, identifier } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly constantName: string;
  readonly freeConstantsInUndischargedAssumptions: readonly string[];
  readonly callerVerifiedArbitraryConstant: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "constantName", label: "Constant name", kind: "string" },
  {
    id: "freeConstantsInUndischargedAssumptions",
    label: "Free constants in undischarged assumptions",
    kind: "stringList",
  },
  {
    id: "callerVerifiedArbitraryConstant",
    label: "Caller verified arbitrary constant",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  identifier(i.constantName);
  i.freeConstantsInUndischargedAssumptions.forEach(identifier);
  return {
    passesDeclaredArbitraryConstantGuard:
      i.callerVerifiedArbitraryConstant &&
      !i.freeConstantsInUndischargedAssumptions.includes(i.constantName),
    fullProofVerified: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    constantName: "a",
    freeConstantsInUndischargedAssumptions: ["b"],
    callerVerifiedArbitraryConstant: true,
  },
  output: {
    result: {
      passesDeclaredArbitraryConstantGuard: true,
      fullProofVerified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/universal-generalization-guard-checker",
  title: "Universal Generalization UG Arbitrary Constant Guard Checker",
  description:
    "Declared natural-deduction universal-generalization arbitrary-constant side condition; no omitted assumption/free-variable analysis.",
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
