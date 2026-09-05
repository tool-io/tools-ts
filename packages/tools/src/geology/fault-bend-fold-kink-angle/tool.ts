import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly firstLimbAnglesDegrees: readonly number[];
  readonly secondLimbAnglesDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKinkRotationsDegrees: readonly number[];
}>;
const inputFields = [
  {
    id: "firstLimbAnglesDegrees",
    label: "First limb angles degrees",
    kind: "numberList",
  },
  {
    id: "secondLimbAnglesDegrees",
    label: "Second limb angles degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.firstLimbAnglesDegrees,
    input.secondLimbAnglesDegrees,
    "firstLimbAnglesDegrees",
  );
  [...input.firstLimbAnglesDegrees, ...input.secondLimbAnglesDegrees].forEach(
    (v) => {
      if (v < -90 || v > 90)
        simpleError("angle", "Signed section limbs within−90..90.");
    },
  );
  return {
    signedKinkRotationsDegrees: input.secondLimbAnglesDegrees.map(
      (v, i) => v - input.firstLimbAnglesDegrees[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstLimbAnglesDegrees: [10, 30],
  secondLimbAnglesDegrees: [40, 10],
} satisfies Input;
export const exampleOutput = {
  signedKinkRotationsDegrees: [30, -20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fault-bend-fold-kink-angle",
  title: "Geology Fault Bend Fold Kink Angle Calculator",
  description:
    "Measured signed section kink rotations for fault-bend fold restoration; no unsupported ramp-to-kink inversion. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKinkRotationsDegrees",
      label: "Signed kink rotations degrees",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      firstLimbAnglesDegrees: value.firstLimbAnglesDegrees as readonly number[],
      secondLimbAnglesDegrees:
        value.secondLimbAnglesDegrees as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
