import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerWaterDensity: number;
  readonly callerMorisonInertiaCoefficient: number;
  readonly actualDisplacedStructureVolume: number;
  readonly actualWaveParticleAcceleration: number;
  readonly callerCalibratedWaveDragCoefficient: number;
  readonly actualWaveProjectedArea: number;
  readonly actualWaveRelativeVelocity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerWaterDensity", label: "Caller water density", kind: "number" },
  {
    id: "callerMorisonInertiaCoefficient",
    label: "Caller morison inertia coefficient",
    kind: "number",
  },
  {
    id: "actualDisplacedStructureVolume",
    label: "Actual displaced structure volume",
    kind: "number",
  },
  {
    id: "actualWaveParticleAcceleration",
    label: "Actual wave particle acceleration",
    kind: "number",
  },
  {
    id: "callerCalibratedWaveDragCoefficient",
    label: "Caller calibrated wave drag coefficient",
    kind: "number",
  },
  {
    id: "actualWaveProjectedArea",
    label: "Actual wave projected area",
    kind: "number",
  },
  {
    id: "actualWaveRelativeVelocity",
    label: "Actual wave relative velocity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerWaterDensity, "callerWaterDensity");
  nonnegative(
    input.callerMorisonInertiaCoefficient,
    "callerMorisonInertiaCoefficient",
  );
  nonnegative(
    input.actualDisplacedStructureVolume,
    "actualDisplacedStructureVolume",
  );
  nonnegative(
    input.callerCalibratedWaveDragCoefficient,
    "callerCalibratedWaveDragCoefficient",
  );
  nonnegative(input.actualWaveProjectedArea, "actualWaveProjectedArea");
  return {
    value:
      input.callerWaterDensity *
        input.callerMorisonInertiaCoefficient *
        input.actualDisplacedStructureVolume *
        input.actualWaveParticleAcceleration +
      0.5 *
        input.callerWaterDensity *
        input.callerCalibratedWaveDragCoefficient *
        input.actualWaveProjectedArea *
        input.actualWaveRelativeVelocity *
        Math.abs(input.actualWaveRelativeVelocity),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerWaterDensity: 1,
    callerMorisonInertiaCoefficient: 1,
    actualDisplacedStructureVolume: 1,
    actualWaveParticleAcceleration: 1,
    callerCalibratedWaveDragCoefficient: 1,
    actualWaveProjectedArea: 1,
    actualWaveRelativeVelocity: 2,
  },
  output: { result: { value: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/wave-force-cage",
  title: "Wave Force Cage Calculator",
  description:
    "Restricted signed collinear Morisonwaveforce inertia plus quadratic drag on actual independently calibrated rigid structure, not current-only panel drag or wave site safety.",
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
