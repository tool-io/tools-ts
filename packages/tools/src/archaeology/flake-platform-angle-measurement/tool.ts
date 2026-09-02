import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pointAngle } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedFlakePlatformRayOne: readonly number[];
  readonly observedFlakePlatformRayTwo: readonly number[];
}>;
export type Output = Readonly<{ readonly observedPlanarAngleDegrees: number }>;
const inputFields = [
  {
    id: "observedFlakePlatformRayOne",
    label: "Observed flake platform ray one",
    kind: "numberList",
  },
  {
    id: "observedFlakePlatformRayTwo",
    label: "Observed flake platform ray two",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    observedPlanarAngleDegrees: pointAngle(
      input.observedFlakePlatformRayOne,
      input.observedFlakePlatformRayTwo,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFlakePlatformRayOne: [1, 0],
  observedFlakePlatformRayTwo: [0, 1],
} satisfies Input;
export const exampleOutput = {
  observedPlanarAngleDegrees: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/flake-platform-angle-measurement",
  title: "Flake Platform Angle Measurement Tool",
  description:
    "Flake Platform actual ordered planar-ray angle from independently identified measurement landmarks;3 Dprojection, protocol and biological interpretation caller established. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPlanarAngleDegrees",
      label: "Observed planar angle degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFlakePlatformRayOne:
        value.observedFlakePlatformRayOne as readonly number[],
      observedFlakePlatformRayTwo:
        value.observedFlakePlatformRayTwo as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
