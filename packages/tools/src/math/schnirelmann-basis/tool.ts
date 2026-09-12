import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFiniteBasisElements: readonly number[];
  readonly actualSumsetTermCount: number;
  readonly actualObservedPrefixCutoff: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFiniteBasisElements",
    label: "Actual finite basis elements",
    kind: "numberList",
  },
  {
    id: "actualSumsetTermCount",
    label: "Actual sumset term count",
    kind: "number",
  },
  {
    id: "actualObservedPrefixCutoff",
    label: "Actual observed prefix cutoff",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualSumsetTermCount, "terms", 1, 16);
  bounded(input.actualObservedPrefixCutoff, "cutoff", 0, 10000);
  if (
    !input.actualFiniteBasisElements.length ||
    input.actualFiniteBasisElements.length > 128 ||
    new Set(input.actualFiniteBasisElements).size !==
      input.actualFiniteBasisElements.length
  )
    simpleError("basis", "Actualdistinctfinitebasis.");
  input.actualFiniteBasisElements.forEach((v) =>
    bounded(v, "element", 0, 10000),
  );
  let a = new Set([0]);
  for (let i = 0; i < input.actualSumsetTermCount; i++) {
    const b = new Set<number>();
    for (const v of a)
      for (const w of input.actualFiniteBasisElements)
        if (v + w <= input.actualObservedPrefixCutoff) b.add(v + w);
    a = b;
  }
  const r = Array.from(
    { length: input.actualObservedPrefixCutoff + 1 },
    (_, i) => i,
  );
  return {
    observedRepresentablePrefixIntegers: r.filter((v) => a.has(v)),
    observedMissingPrefixIntegers: r.filter((v) => !a.has(v)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFiniteBasisElements: [0, 1, 3],
    actualSumsetTermCount: 2,
    actualObservedPrefixCutoff: 6,
  },
  output: {
    result: {
      observedRepresentablePrefixIntegers: [0, 1, 2, 3, 4, 6],
      observedMissingPrefixIntegers: [5],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/schnirelmann-basis",
  title: "Schnirelmann Basis Calculator",
  description:
    "Exactfiniteh-fold sum set of actual basis with repetition and prefix coverage, no infiniteSchnirelmannadditivebasisdensity proof. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
