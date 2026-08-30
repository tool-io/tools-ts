import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { tubeMpn } from "../shared.js";

export type Input = Readonly<{
  readonly volumesMl: readonly number[];
  readonly positiveTubes: readonly number[];
  readonly totalTubes: readonly number[];
}>;
export type Output = Readonly<{
  readonly mpnPerMl: number;
  readonly mpnPer100Ml: number;
}>;
export const calculate = (input: Input): Output => {
  const mpnPerMl = tubeMpn(input);
  return { mpnPerMl, mpnPer100Ml: 100 * mpnPerMl };
};
export const exampleInput = {
  volumesMl: [1, 1, 1],
  positiveTubes: [1, 1, 1],
  totalTubes: [2, 2, 2],
} satisfies Input;
export const exampleOutput = {
  mpnPerMl: 0.6931471805599453,
  mpnPer100Ml: 69.31471805599453,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/tube-design-mpn-estimate",
  title: "Tube Design MPN Estimate",
  description:
    "Fit a Poisson tube-positivity MPN by maximum likelihood using actual inoculum volumes, replacing a fixed three-tube lookup table.",
  inputs: [
    { id: "volumesMl", label: "Volumes ml", kind: "numberList" },
    { id: "positiveTubes", label: "Positive tubes", kind: "numberList" },
    { id: "totalTubes", label: "Total tubes", kind: "numberList" },
  ],
  outputs: [
    { id: "mpnPerMl", label: "Mpn per ml", kind: "number" },
    { id: "mpnPer100Ml", label: "Mpn per 100 ml", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      volumesMl: value.volumesMl as readonly number[],
      positiveTubes: value.positiveTubes as readonly number[],
      totalTubes: value.totalTubes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
