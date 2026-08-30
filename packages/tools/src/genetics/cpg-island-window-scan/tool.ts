import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction, nonnegative, dna } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly windowLength: number;
  readonly stepLength: number;
  readonly minimumGcFraction: number;
  readonly minimumObservedExpected: number;
}>;
export type Output = Readonly<{
  readonly windowStarts: readonly number[];
  readonly gcFractions: readonly number[];
  readonly cpgObservedExpected: readonly number[];
  readonly islandStarts: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence);
  count(input.windowLength, "windowLength", 2);
  count(input.stepLength, "stepLength", 1);
  fraction(input.minimumGcFraction, "minimumGcFraction");
  nonnegative(input.minimumObservedExpected, "minimumObservedExpected");
  if (
    input.windowLength > s.length ||
    Math.ceil(s.length / input.stepLength) * input.windowLength > 10000000
  )
    simpleError(
      "windowLength",
      "Window must fit within the sequence and comparison budget.",
    );
  const windowStarts: number[] = [],
    gcFractions: number[] = [],
    cpgObservedExpected: number[] = [],
    islandStarts: number[] = [];
  for (let i = 0; i + input.windowLength <= s.length; i += input.stepLength) {
    const region = s.slice(i, i + input.windowLength),
      c = [...region].filter((v) => v === "C").length,
      g = [...region].filter((v) => v === "G").length;
    let cpg = 0;
    for (let j = 0; j < region.length - 1; j++)
      if (region.slice(j, j + 2) === "CG") cpg++;
    const gc = (c + g) / region.length,
      oe = c * g === 0 ? 0 : (cpg * region.length) / (c * g);
    windowStarts.push(i);
    gcFractions.push(gc);
    cpgObservedExpected.push(oe);
    if (gc >= input.minimumGcFraction && oe >= input.minimumObservedExpected)
      islandStarts.push(i);
  }
  return { windowStarts, gcFractions, cpgObservedExpected, islandStarts };
};
export const exampleInput = {
  sequence: "CGCGAAAA",
  windowLength: 4,
  stepLength: 4,
  minimumGcFraction: 0.5,
  minimumObservedExpected: 0.6,
} satisfies Input;
export const exampleOutput = {
  windowStarts: [0, 4],
  gcFractions: [1, 0],
  cpgObservedExpected: [2, 0],
  islandStarts: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/cpg-island-window-scan",
  title: "CPG Island Window Scan",
  description:
    "Classify DNA windows by GC fraction and CpG observed/expected ratio using caller criteria.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "windowLength", label: "Window length", kind: "integer" },
    { id: "stepLength", label: "Step length", kind: "integer" },
    { id: "minimumGcFraction", label: "Minimum gc fraction", kind: "number" },
    {
      id: "minimumObservedExpected",
      label: "Minimum observed expected",
      kind: "number",
    },
  ],
  outputs: [
    { id: "windowStarts", label: "Window starts", kind: "numberList" },
    { id: "gcFractions", label: "Gc fractions", kind: "numberList" },
    {
      id: "cpgObservedExpected",
      label: "Cpg observed expected",
      kind: "numberList",
    },
    { id: "islandStarts", label: "Island starts", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      windowLength: value.windowLength as number,
      stepLength: value.stepLength as number,
      minimumGcFraction: value.minimumGcFraction as number,
      minimumObservedExpected: value.minimumObservedExpected as number,
    }),
});
export const run = tool.execute;
export default tool;
