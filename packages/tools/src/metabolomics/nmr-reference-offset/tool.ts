import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedTmsPpm: number;
  readonly measuredShiftsPpm: readonly number[];
}>;
export type Output = Readonly<{
  readonly referenceOffsetPpm: number;
  readonly correctedShiftsPpm: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const referenceOffsetPpm = -input.observedTmsPpm;
  return {
    referenceOffsetPpm,
    correctedShiftsPpm: input.measuredShiftsPpm.map(
      (v) => v + referenceOffsetPpm,
    ),
  };
};
export const exampleInput = {
  observedTmsPpm: 0.2,
  measuredShiftsPpm: [1.2, 2.2],
} satisfies Input;
export const exampleOutput = {
  referenceOffsetPpm: -0.2,
  correctedShiftsPpm: [1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/nmr-reference-offset",
  title: "NMR Reference Offset",
  description: "Re-reference NMR chemical shifts to observed TMS zero.",
  inputs: [
    { id: "observedTmsPpm", kind: "number", label: "Observed tms ppm" },
    {
      id: "measuredShiftsPpm",
      kind: "numberList",
      label: "Measured shifts ppm",
    },
  ],
  outputs: [
    { id: "referenceOffsetPpm", kind: "number", label: "Reference offset ppm" },
    {
      id: "correctedShiftsPpm",
      kind: "numberList",
      label: "Corrected shifts ppm",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTmsPpm: value.observedTmsPpm as number,
      measuredShiftsPpm: value.measuredShiftsPpm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
