import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEffectiveExhaustVelocityMetersPerSecond: number;
  readonly initialMassKg: number;
  readonly finalMassKg: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerVerifiedEffectiveExhaustVelocityMetersPerSecond",
    label: "Caller verified effective exhaust velocity meters per second",
    kind: "number",
  },
  { id: "initialMassKg", label: "Initial mass kg", kind: "number" },
  { id: "finalMassKg", label: "Final mass kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerVerifiedEffectiveExhaustVelocityMetersPerSecond,
    "callerVerifiedEffectiveExhaustVelocityMetersPerSecond",
  );
  positive(input.initialMassKg, "initialMassKg");
  positive(input.finalMassKg, "finalMassKg");
  if (input.initialMassKg < input.finalMassKg) simpleError("mass", "m0≥mf.");
  return {
    value:
      input.callerVerifiedEffectiveExhaustVelocityMetersPerSecond *
      Math.log(input.initialMassKg / input.finalMassKg),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedEffectiveExhaustVelocityMetersPerSecond: 10,
    initialMassKg: 2,
    finalMassKg: 1,
  },
  output: { result: { value: 6.931471805599453 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/rocket-delta-v",
  title: "Tsiolkovsky Delta-V Calculator",
  description:
    "Ideal Tsiolkovskyrocket deltaVve ln(m0/mf), single positive mass ratio\u22651; external forces, staging and actual flight dynamics excluded. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
