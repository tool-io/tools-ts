import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly cellStates: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cellStates", label: "Cell states", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  i.cellStates.forEach((s) => pick(s, { "0": 0, "1": 1, X: 2 }, "cell"));
  const n = i.cellStates.filter((s) => s === "X").length;
  return {
    dontCareCount: n,
    possibleAssignmentsDecimal: (1n << BigInt(n)).toString(),
    logicMinimized: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { cellStates: ["0", "X", "1", "X"] },
  output: {
    result: {
      dontCareCount: 2,
      possibleAssignmentsDecimal: "4",
      logicMinimized: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/dontcare-flexibility-note-generator",
  title: "Don't-Care X Cell Count Flexibility Note Generator",
  description:
    "Count explicitly supplied dont-care cells and 2^X independent assignments; no minimization or arbitrary hardware validity.",
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
