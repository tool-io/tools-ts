import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, speed, period } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly initialRadius: number;
  readonly finalRadius: number;
}>;
export type Output = Readonly<{
  readonly burnMagnitudes: readonly number[];
  readonly totalDeltaV: number;
  readonly transferCoastTime: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.mu, "mu");
  positive(input.initialRadius, "initialRadius");
  positive(input.finalRadius, "finalRadius");
  const a = (input.initialRadius + input.finalRadius) / 2,
    burnMagnitudes = [
      Math.abs(
        speed(input.mu, input.initialRadius, a) -
          Math.sqrt(input.mu / input.initialRadius),
      ),
      Math.abs(
        Math.sqrt(input.mu / input.finalRadius) -
          speed(input.mu, input.finalRadius, a),
      ),
    ];
  return {
    burnMagnitudes,
    totalDeltaV: burnMagnitudes.reduce((x, y) => x + y, 0),
    transferCoastTime: period(input.mu, a) / 2,
  };
};
export const exampleInput = {
  mu: 1,
  initialRadius: 1,
  finalRadius: 4,
} satisfies Input;
export const exampleOutput = {
  burnMagnitudes: [0.26491106406735176, 0.18377223398316206],
  totalDeltaV: 0.4486832980505138,
  transferCoastTime: 12.418235332245125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/hohmann-transfer-budget",
  title: "Hohmann Transfer Budget",
  description:
    "Compute both coplanar Hohmann burn magnitudes, total impulse, and half-period coast time for circular endpoints.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "initialRadius", label: "Initial radius", kind: "number" },
    { id: "finalRadius", label: "Final radius", kind: "number" },
  ],
  outputs: [
    { id: "burnMagnitudes", label: "Burn magnitudes", kind: "numberList" },
    { id: "totalDeltaV", label: "Total delta v", kind: "number" },
    { id: "transferCoastTime", label: "Transfer coast time", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      initialRadius: value.initialRadius as number,
      finalRadius: value.finalRadius as number,
    }),
});
export const run = tool.execute;
export default tool;
