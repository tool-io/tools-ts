import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerGravityMetersPerSecondSquared: number;
  readonly actualIdealHeadMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerGravityMetersPerSecondSquared",
    label: "Caller gravity meters per second squared",
    kind: "number",
  },
  {
    id: "actualIdealHeadMeters",
    label: "Actual ideal head meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerGravityMetersPerSecondSquared,
    "callerGravityMetersPerSecondSquared",
  );
  nonnegative(input.actualIdealHeadMeters, "actualIdealHeadMeters");
  return {
    value: Math.sqrt(
      2 *
        input.callerGravityMetersPerSecondSquared *
        input.actualIdealHeadMeters,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerGravityMetersPerSecondSquared: 2, actualIdealHeadMeters: 1 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/torricelli-velocity",
  title: "Plumbing Torricelli Velocity Calculator",
  description:
    "Ideal Torricelli free jet speed\u221a2gh, actual head/density-independent inviscidlarge-reservoir limit, no orifice discharge coefficient or safe release. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
