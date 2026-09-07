import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTfetOnGateVoltages: readonly number[];
  readonly observedMatchedTfetOnCurrentAmps: readonly number[];
  readonly queryTfetOnGateVoltage: number;
}>;
export type Output = Readonly<{
  readonly interpolatedTfetOnCurrentAmps: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedTfetOnGateVoltages",
    label: "Observed tfet on gate voltages",
    kind: "numberList",
  },
  {
    id: "observedMatchedTfetOnCurrentAmps",
    label: "Observed matched tfet on current amps",
    kind: "numberList",
  },
  {
    id: "queryTfetOnGateVoltage",
    label: "Query tfet on gate voltage",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedTfetOnCurrentAmps.forEach((v) =>
    positive(v, "observedMatchedTfetOnCurrentAmps"),
  );
  input.observedTfetOnGateVoltages.forEach((v) =>
    nonnegative(v, "observedTfetOnGateVoltages"),
  );
  nonnegative(input.queryTfetOnGateVoltage, "queryTfetOnGateVoltage");
  const result = curve(
    input.observedTfetOnGateVoltages,
    input.observedMatchedTfetOnCurrentAmps,
    input.queryTfetOnGateVoltage,
  );
  return {
    interpolatedTfetOnCurrentAmps: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTfetOnGateVoltages: [1, 2, 3],
  observedMatchedTfetOnCurrentAmps: [2, 4, 8],
  queryTfetOnGateVoltage: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedTfetOnCurrentAmps: 6,
  localMeasuredResponseDerivative: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/tunnel-fet-on-current",
  title: "Semiconductor Tunnel Fet On Current Calculator",
  description:
    "Read actual independently selected TFET on-state gate/current branch at matched drain voltage, not generic field-driven Kane approximation. Independently matched measured piecewise-linear curve only, local slope retained; no extrapolation, invented material constants, process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedTfetOnCurrentAmps",
      label: "Interpolated tfet on current amps",
      kind: "number",
    },
    {
      id: "localMeasuredResponseDerivative",
      label: "Local measured response derivative",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTfetOnGateVoltages:
        value.observedTfetOnGateVoltages as readonly number[],
      observedMatchedTfetOnCurrentAmps:
        value.observedMatchedTfetOnCurrentAmps as readonly number[],
      queryTfetOnGateVoltage: value.queryTfetOnGateVoltage as number,
    }),
});
export const run = tool.execute;
export default tool;
