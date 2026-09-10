import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedCollectorDopingPerCubicMeter: number;
  readonly independentlyEstablishedSaturatedVelocityMetersPerSecond: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedCollectorDopingPerCubicMeter",
    label: "Independently established collector doping per cubic meter",
    kind: "number",
  },
  {
    id: "independentlyEstablishedSaturatedVelocityMetersPerSecond",
    label: "Independently established saturated velocity meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.independentlyEstablishedCollectorDopingPerCubicMeter,
    "doping",
  );
  positive(
    input.independentlyEstablishedSaturatedVelocityMetersPerSecond,
    "velocity",
  );
  return {
    conditionalKirkOnsetCurrentDensityAmpsPerSquareMeter:
      1.602176634e-19 *
      input.independentlyEstablishedCollectorDopingPerCubicMeter *
      input.independentlyEstablishedSaturatedVelocityMetersPerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedCollectorDopingPerCubicMeter: 1e21,
    independentlyEstablishedSaturatedVelocityMetersPerSecond: 100000.0,
  },
  output: {
    result: {
      conditionalKirkOnsetCurrentDensityAmpsPerSquareMeter: 16021766.34,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/kirk-effect-onset-current",
  title: "Semiconductor Kirk Effect Onset Current Calculator",
  description:
    "Ideal Kirkcharge-density equality J\u2248qNcvsatwith SIvolume density and velocity; neglects field profile, recombination and device geometry. Not an actual measured onset, current rating or safe operating limit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
