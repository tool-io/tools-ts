import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerIndependentRequiredVerticalSupportForce: number;
  readonly actualSymmetricStrapAngleDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerIndependentRequiredVerticalSupportForce",
    label: "Caller independent required vertical support force",
    kind: "number",
  },
  {
    id: "actualSymmetricStrapAngleDegrees",
    label: "Actual symmetric strap angle degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.callerIndependentRequiredVerticalSupportForce,
    "callerIndependentRequiredVerticalSupportForce",
  );
  positive(
    input.actualSymmetricStrapAngleDegrees,
    "actualSymmetricStrapAngleDegrees",
  );
  if (input.actualSymmetricStrapAngleDegrees > 90)
    simpleError("angle", "Actual0<θ≤90°.");
  return {
    value:
      input.callerIndependentRequiredVerticalSupportForce /
      (2 * Math.sin((input.actualSymmetricStrapAngleDegrees * Math.PI) / 180)),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentRequiredVerticalSupportForce: 10,
    actualSymmetricStrapAngleDegrees: 90,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/strap-tension-required",
  title: "Strap Tension Required Calculator",
  description:
    "Ideal static TWO symmetric tensions traps upwardverticalbalanceT=W/[2sin\u03b8],0<\u03b8\u226490\u00b0, not select wearer force or safe comfortable tension.",
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
