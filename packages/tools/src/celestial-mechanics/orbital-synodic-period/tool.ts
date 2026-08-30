import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly firstSiderealPeriod: number;
  readonly secondSiderealPeriod: number;
}>;
export type Output = Readonly<{
  readonly synodicPeriod: number;
  readonly relativeCyclesPerTime: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.firstSiderealPeriod, "firstSiderealPeriod");
  positive(input.secondSiderealPeriod, "secondSiderealPeriod");
  const relativeCyclesPerTime = Math.abs(
    1 / input.firstSiderealPeriod - 1 / input.secondSiderealPeriod,
  );
  positive(relativeCyclesPerTime, "secondSiderealPeriod");
  return { synodicPeriod: 1 / relativeCyclesPerTime, relativeCyclesPerTime };
};
export const exampleInput = {
  firstSiderealPeriod: 2,
  secondSiderealPeriod: 3,
} satisfies Input;
export const exampleOutput = {
  synodicPeriod: 6,
  relativeCyclesPerTime: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/orbital-synodic-period",
  title: "Orbital Synodic Period",
  description:
    "Compute a synodic alignment period from two same-direction sidereal periods; equal periods have no finite relative cycle.",
  inputs: [
    {
      id: "firstSiderealPeriod",
      label: "First sidereal period",
      kind: "number",
    },
    {
      id: "secondSiderealPeriod",
      label: "Second sidereal period",
      kind: "number",
    },
  ],
  outputs: [
    { id: "synodicPeriod", label: "Synodic period", kind: "number" },
    {
      id: "relativeCyclesPerTime",
      label: "Relative cycles per time",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstSiderealPeriod: value.firstSiderealPeriod as number,
      secondSiderealPeriod: value.secondSiderealPeriod as number,
    }),
});
export const run = tool.execute;
export default tool;
