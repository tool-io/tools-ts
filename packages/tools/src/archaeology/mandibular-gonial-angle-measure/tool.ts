import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pointAngle } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedMandibularGonialRayOne: readonly number[];
  readonly observedMandibularGonialRayTwo: readonly number[];
}>;
export type Output = Readonly<{ readonly observedPlanarAngleDegrees: number }>;
const inputFields = [
  {
    id: "observedMandibularGonialRayOne",
    label: "Observed mandibular gonial ray one",
    kind: "numberList",
  },
  {
    id: "observedMandibularGonialRayTwo",
    label: "Observed mandibular gonial ray two",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    observedPlanarAngleDegrees: pointAngle(
      input.observedMandibularGonialRayOne,
      input.observedMandibularGonialRayTwo,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMandibularGonialRayOne: [1, 0],
  observedMandibularGonialRayTwo: [0, 1],
} satisfies Input;
export const exampleOutput = {
  observedPlanarAngleDegrees: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/mandibular-gonial-angle-measure",
  title: "Mandibular Gonial Angle Measurement Tool",
  description:
    "Mandibular Gonial actual ordered planar-ray angle from independently identified measurement landmarks;3 Dprojection, protocol and biological interpretation caller established. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
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
      observedMandibularGonialRayOne:
        value.observedMandibularGonialRayOne as readonly number[],
      observedMandibularGonialRayTwo:
        value.observedMandibularGonialRayTwo as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
