import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{ readonly physicalLines: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "physicalLines", label: "Physical lines", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  const parity = i.physicalLines.map(
    (s) => [...s].filter((c) => c === String.fromCharCode(34)).length % 2,
  );
  let open = false;
  const transitions = parity.flatMap((p, j) => {
    if (p) {
      open = !open;
      return [j];
    }
    return [];
  });
  return {
    oddQuotePhysicalLineIndices: parity.flatMap((v, j) => (v ? [j] : [])),
    quoteStateTransitionLineIndices: transitions,
    unclosedQuoteAtEnd: open,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { physicalLines: ['a,"b', 'c",d'] },
  output: {
    result: {
      oddQuotePhysicalLineIndices: [0, 1],
      quoteStateTransitionLineIndices: [0, 1],
      unclosedQuoteAtEnd: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "csv/unbalanced-quote-per-row-detector",
  title: "Unbalanced Quote Per Row Detector",
  description:
    "Double-quote parity diagnostics over ordered physical lines, preserving multiline quoted fields; not full CSV syntax validation or proof each odd line malformed.",
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
