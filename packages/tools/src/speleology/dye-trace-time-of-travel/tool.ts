import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyEstablishedTracerTravelDistanceMeters: number;
  readonly actualObservedTracerTravelSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyEstablishedTracerTravelDistanceMeters",
    label: "Actual independently established tracer travel distance meters",
    kind: "number",
  },
  {
    id: "actualObservedTracerTravelSeconds",
    label: "Actual observed tracer travel seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyEstablishedTracerTravelDistanceMeters,
    "numerator",
  );
  positive(input.actualObservedTracerTravelSeconds, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyEstablishedTracerTravelDistanceMeters) /
      input.actualObservedTracerTravelSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyEstablishedTracerTravelDistanceMeters: 2,
    actualObservedTracerTravelSeconds: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/dye-trace-time-of-travel",
  title: "Dye Trace Time of Travel Velocity Calculator",
  description:
    "Actual dye travel velocity along independently established path and selected arrival definition, not straightline source/spring distance assumed hydrological path. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
