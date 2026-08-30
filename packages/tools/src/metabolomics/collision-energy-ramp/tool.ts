import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mzValues: readonly number[];
  readonly interceptEv: number;
  readonly slopeEvPerMz: number;
  readonly maximumEv: number;
}>;
export type Output = Readonly<{
  readonly collisionEnergiesEv: readonly number[];
  readonly cappedCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.mzValues.some((v) => v < 0) || input.maximumEv < 0)
    simpleError(
      "mzValues",
      "Nonnegative m/z and maximum collision energy required.",
    );
  const raw = input.mzValues.map(
      (v) => input.interceptEv + input.slopeEvPerMz * v,
    ),
    collisionEnergiesEv = raw.map((v) =>
      Math.max(0, Math.min(v, input.maximumEv)),
    );
  return {
    collisionEnergiesEv,
    cappedCount: raw.filter((v) => v > input.maximumEv).length,
  };
};
export const exampleInput = {
  mzValues: [100, 200],
  interceptEv: 10,
  slopeEvPerMz: 0.1,
  maximumEv: 25,
} satisfies Input;
export const exampleOutput = {
  collisionEnergiesEv: [20, 25],
  cappedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/collision-energy-ramp",
  title: "Collision Energy Ramp",
  description:
    "Plan collision-energy ramp with caller-supplied slope, intercept, and cap.",
  inputs: [
    { id: "mzValues", kind: "numberList", label: "Mz values" },
    { id: "interceptEv", kind: "number", label: "Intercept ev" },
    { id: "slopeEvPerMz", kind: "number", label: "Slope ev per mz" },
    { id: "maximumEv", kind: "number", label: "Maximum ev" },
  ],
  outputs: [
    {
      id: "collisionEnergiesEv",
      kind: "numberList",
      label: "Collision energies ev",
    },
    { id: "cappedCount", kind: "number", label: "Capped count" },
  ],
  calculate: (value) =>
    calculate({
      mzValues: value.mzValues as readonly number[],
      interceptEv: value.interceptEv as number,
      slopeEvPerMz: value.slopeEvPerMz as number,
      maximumEv: value.maximumEv as number,
    }),
});
export const run = tool.execute;
export default tool;
