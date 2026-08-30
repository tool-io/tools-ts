import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CentsBetweenTwoFrequenciesInput = Readonly<{
  readonly referenceHertz: number;
  readonly targetHertz: number;
}>;
export type CentsBetweenTwoFrequenciesOutput = Readonly<{
  readonly cents: number;
}>;

export const calculateCentsBetweenTwoFrequencies = (
  x: CentsBetweenTwoFrequenciesInput,
): CentsBetweenTwoFrequenciesOutput => {
  if (!Number.isFinite(x.referenceHertz) || x.referenceHertz <= 0)
    simpleError("referenceHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.targetHertz) || x.targetHertz <= 0)
    simpleError("targetHertz", "Provide a finite positive number.");
  const cents = 1200 * Math.log2(x.targetHertz / x.referenceHertz);
  if (!Number.isFinite(cents))
    simpleError("cents", "Inputs produce an undefined or out-of-range result.");
  return { cents: Object.is(cents, -0) ? 0 : cents };
};

export const example = {
  input: {
    referenceHertz: 440,
    targetHertz: 880,
  },
  output: { cents: 1200 },
} satisfies ToolExample<
  CentsBetweenTwoFrequenciesInput,
  CentsBetweenTwoFrequenciesOutput
>;

export const tool = createSimpleTool({
  id: "music/cents-between-two-frequencies",
  title: "Cents Between Two Frequencies",
  description:
    "Signed interval in cents from a positive reference frequency to a positive target frequency.",
  inputs: [
    {
      id: "referenceHertz",
      kind: "number",
      label: "Reference Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "targetHertz",
      kind: "number",
      label: "Target Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [{ id: "cents", kind: "number", label: "Cents", unit: "cent" }],
  calculate: (input) =>
    calculateCentsBetweenTwoFrequencies({
      referenceHertz: input.referenceHertz as number,
      targetHertz: input.targetHertz as number,
    }),
});
export const centsBetweenTwoFrequenciesTool = tool;
export const runCentsBetweenTwoFrequencies = tool.execute;
export default tool;
