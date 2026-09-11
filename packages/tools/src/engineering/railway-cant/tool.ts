import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualTrackGaugeMeters: number;
  readonly actualSpeedMetersPerSecond: number;
  readonly callerGravityMetersPerSecondSquared: number;
  readonly actualCurveRadiusMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTrackGaugeMeters",
    label: "Actual track gauge meters",
    kind: "number",
  },
  {
    id: "actualSpeedMetersPerSecond",
    label: "Actual speed meters per second",
    kind: "number",
  },
  {
    id: "callerGravityMetersPerSecondSquared",
    label: "Caller gravity meters per second squared",
    kind: "number",
  },
  {
    id: "actualCurveRadiusMeters",
    label: "Actual curve radius meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualTrackGaugeMeters, "actualTrackGaugeMeters");
  nonnegative(input.actualSpeedMetersPerSecond, "actualSpeedMetersPerSecond");
  positive(
    input.callerGravityMetersPerSecondSquared,
    "callerGravityMetersPerSecondSquared",
  );
  positive(input.actualCurveRadiusMeters, "actualCurveRadiusMeters");
  return {
    value:
      (input.actualTrackGaugeMeters * input.actualSpeedMetersPerSecond ** 2) /
      (input.callerGravityMetersPerSecondSquared *
        input.actualCurveRadiusMeters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTrackGaugeMeters: 2,
    actualSpeedMetersPerSecond: 2,
    callerGravityMetersPerSecondSquared: 2,
    actualCurveRadiusMeters: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/railway-cant",
  title: "Railway Cant Calculator",
  description:
    "Ideal equilibrium railway cant gauge v\u00b2/(gR), SI, a geometric balance only, no permissible speed, cant deficiency, vehicle dynamics or track code. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
