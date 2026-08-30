import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InverseSquareLawLevelChangeInput = Readonly<{
  readonly initialMeters: number;
  readonly finalMeters: number;
}>;
export type InverseSquareLawLevelChangeOutput = Readonly<{
  readonly changeDecibels: number;
}>;

export const calculateInverseSquareLawLevelChange = (
  x: InverseSquareLawLevelChangeInput,
): InverseSquareLawLevelChangeOutput => {
  if (!Number.isFinite(x.initialMeters) || x.initialMeters <= 0)
    simpleError("initialMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.finalMeters) || x.finalMeters <= 0)
    simpleError("finalMeters", "Provide a finite positive number.");
  const changeDecibels = -20 * Math.log10(x.finalMeters / x.initialMeters);
  if (!Number.isFinite(changeDecibels))
    simpleError(
      "changeDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { changeDecibels: Object.is(changeDecibels, -0) ? 0 : changeDecibels };
};

export const example = {
  input: {
    initialMeters: 1,
    finalMeters: 2,
  },
  output: { changeDecibels: -6.020599913279624 },
} satisfies ToolExample<
  InverseSquareLawLevelChangeInput,
  InverseSquareLawLevelChangeOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/inverse-square-law-level-change",
  title: "Inverse Square Law Level Change",
  description:
    "Free-field point-source sound-level change in dB when observation distance changes from r1 to r2.",
  inputs: [
    {
      id: "initialMeters",
      kind: "number",
      label: "Initial Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "finalMeters",
      kind: "number",
      label: "Final Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "changeDecibels",
      kind: "number",
      label: "Change Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateInverseSquareLawLevelChange({
      initialMeters: input.initialMeters as number,
      finalMeters: input.finalMeters as number,
    }),
});
export const inverseSquareLawLevelChangeTool = tool;
export const runInverseSquareLawLevelChange = tool.execute;
export default tool;
