import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly firstAlleleMarkerSignal: number;
  readonly secondAlleleMarkerSignal: number;
  readonly minimumDetectedSignal: number;
}>;
export type Output = Readonly<{
  readonly firstMarkerDetected: boolean;
  readonly secondMarkerDetected: boolean;
  readonly bothMarkersExpressed: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.firstAlleleMarkerSignal, "firstAlleleMarkerSignal");
  nonnegative(input.secondAlleleMarkerSignal, "secondAlleleMarkerSignal");
  positive(input.minimumDetectedSignal, "minimumDetectedSignal");
  const firstMarkerDetected =
      input.firstAlleleMarkerSignal >= input.minimumDetectedSignal,
    secondMarkerDetected =
      input.secondAlleleMarkerSignal >= input.minimumDetectedSignal;
  return {
    firstMarkerDetected,
    secondMarkerDetected,
    bothMarkersExpressed: firstMarkerDetected && secondMarkerDetected,
  };
};
export const exampleInput = {
  firstAlleleMarkerSignal: 4,
  secondAlleleMarkerSignal: 3,
  minimumDetectedSignal: 2,
} satisfies Input;
export const exampleOutput = {
  firstMarkerDetected: true,
  secondMarkerDetected: true,
  bothMarkersExpressed: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/codominant-expression-screen",
  title: "Codominant Expression Screen",
  description:
    "Screen distinct allele-marker signals for simultaneous expression at a caller-defined detection threshold.",
  inputs: [
    {
      id: "firstAlleleMarkerSignal",
      label: "First allele marker signal",
      kind: "number",
    },
    {
      id: "secondAlleleMarkerSignal",
      label: "Second allele marker signal",
      kind: "number",
    },
    {
      id: "minimumDetectedSignal",
      label: "Minimum detected signal",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "firstMarkerDetected",
      label: "First marker detected",
      kind: "boolean",
    },
    {
      id: "secondMarkerDetected",
      label: "Second marker detected",
      kind: "boolean",
    },
    {
      id: "bothMarkersExpressed",
      label: "Both markers expressed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      firstAlleleMarkerSignal: value.firstAlleleMarkerSignal as number,
      secondAlleleMarkerSignal: value.secondAlleleMarkerSignal as number,
      minimumDetectedSignal: value.minimumDetectedSignal as number,
    }),
});
export const run = tool.execute;
export default tool;
