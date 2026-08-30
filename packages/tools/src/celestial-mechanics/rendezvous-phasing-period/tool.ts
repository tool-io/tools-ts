import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count } from "../shared.js";

export type Input = Readonly<{
  readonly targetOrbitPeriod: number;
  readonly targetAheadDegrees: number;
  readonly targetRevolutions: number;
  readonly phasingLoops: number;
}>;
export type Output = Readonly<{
  readonly requiredPhasingPeriod: number;
  readonly rendezvousElapsedTime: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.targetOrbitPeriod, "targetOrbitPeriod");
  count(input.targetRevolutions, "targetRevolutions", 1);
  count(input.phasingLoops, "phasingLoops", 1);
  if (input.targetAheadDegrees < 0 || input.targetAheadDegrees >= 360)
    simpleError(
      "targetAheadDegrees",
      "Target ahead angle must lie in [0,360).",
    );
  const rendezvousElapsedTime =
    (input.targetRevolutions - input.targetAheadDegrees / 360) *
    input.targetOrbitPeriod;
  return {
    requiredPhasingPeriod: rendezvousElapsedTime / input.phasingLoops,
    rendezvousElapsedTime,
  };
};
export const exampleInput = {
  targetOrbitPeriod: 100,
  targetAheadDegrees: 90,
  targetRevolutions: 1,
  phasingLoops: 1,
} satisfies Input;
export const exampleOutput = {
  requiredPhasingPeriod: 75,
  rendezvousElapsedTime: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/rendezvous-phasing-period",
  title: "Rendezvous Phasing Period",
  description:
    "Choose a phasing-loop period for point rendezvous after supplied target revolutions; no safe pericenter or burn budget is inferred.",
  inputs: [
    { id: "targetOrbitPeriod", label: "Target orbit period", kind: "number" },
    { id: "targetAheadDegrees", label: "Target ahead degrees", kind: "number" },
    { id: "targetRevolutions", label: "Target revolutions", kind: "integer" },
    { id: "phasingLoops", label: "Phasing loops", kind: "integer" },
  ],
  outputs: [
    {
      id: "requiredPhasingPeriod",
      label: "Required phasing period",
      kind: "number",
    },
    {
      id: "rendezvousElapsedTime",
      label: "Rendezvous elapsed time",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetOrbitPeriod: value.targetOrbitPeriod as number,
      targetAheadDegrees: value.targetAheadDegrees as number,
      targetRevolutions: value.targetRevolutions as number,
      phasingLoops: value.phasingLoops as number,
    }),
});
export const run = tool.execute;
export default tool;
