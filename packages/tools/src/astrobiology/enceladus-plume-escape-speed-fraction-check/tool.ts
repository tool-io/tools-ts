import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedParticleSpeedsMetersPerSecond: readonly number[];
  readonly callerVerifiedEscapeSpeedMetersPerSecond: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedParticleSpeedsMetersPerSecond",
    label: "Independently observed particle speeds meters per second",
    kind: "numberList",
  },
  {
    id: "callerVerifiedEscapeSpeedMetersPerSecond",
    label: "Caller verified escape speed meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyObservedParticleSpeedsMetersPerSecond.length)
    simpleError("sample", "Actual nonempty particle speed observations.");
  input.independentlyObservedParticleSpeedsMetersPerSecond.forEach((v) =>
    nonnegative(v, "speed"),
  );
  positive(input.callerVerifiedEscapeSpeedMetersPerSecond, "escape");
  return {
    observedAtOrAboveEscapeFraction:
      input.independentlyObservedParticleSpeedsMetersPerSecond.filter(
        (v) => v >= input.callerVerifiedEscapeSpeedMetersPerSecond,
      ).length /
      input.independentlyObservedParticleSpeedsMetersPerSecond.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedParticleSpeedsMetersPerSecond: [100, 300],
    callerVerifiedEscapeSpeedMetersPerSecond: 200,
  },
  output: { result: { observedAtOrAboveEscapeFraction: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/enceladus-plume-escape-speed-fraction-check",
  title: "Enceladus Plume Particle Escape Speed Fraction Check Calculator",
  description:
    "Actual equally weighted plume speed sample share at/above independently established local escape speed. Not total mass escaping or dynamical fate under drag, Saturntides/geometry.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
