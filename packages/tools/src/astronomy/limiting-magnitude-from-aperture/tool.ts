import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly apertureMm: number;
  readonly callerReferenceApertureMm: number;
  readonly callerObservedReferenceLimitingMagnitude: number;
  readonly callerCalibratedApertureLogCoefficient: number;
}>;
export type Output = Readonly<{
  readonly conditionalLimitingMagnitude: number;
}>;
const inputFields = [
  { id: "apertureMm", label: "Aperture mm", kind: "number" },
  {
    id: "callerReferenceApertureMm",
    label: "Caller reference aperture mm",
    kind: "number",
  },
  {
    id: "callerObservedReferenceLimitingMagnitude",
    label: "Caller observed reference limiting magnitude",
    kind: "number",
  },
  {
    id: "callerCalibratedApertureLogCoefficient",
    label: "Caller calibrated aperture log coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.apertureMm, "apertureMm");
  positive(input.callerReferenceApertureMm, "callerReferenceApertureMm");
  return {
    conditionalLimitingMagnitude:
      input.callerObservedReferenceLimitingMagnitude +
      input.callerCalibratedApertureLogCoefficient *
        Math.log10(input.apertureMm / input.callerReferenceApertureMm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  apertureMm: 100,
  callerReferenceApertureMm: 10,
  callerObservedReferenceLimitingMagnitude: 6,
  callerCalibratedApertureLogCoefficient: 5,
} satisfies Input;
export const exampleOutput = {
  conditionalLimitingMagnitude: 11,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/limiting-magnitude-from-aperture",
  title: "Limiting Magnitude From Aperture",
  description:
    "Explicit independently calibrated limiting-magnitude aperture proxy, sky/observer/seeing matched by caller; no universal visual limit. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalLimitingMagnitude",
      label: "Conditional limiting magnitude",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      apertureMm: value.apertureMm as number,
      callerReferenceApertureMm: value.callerReferenceApertureMm as number,
      callerObservedReferenceLimitingMagnitude:
        value.callerObservedReferenceLimitingMagnitude as number,
      callerCalibratedApertureLogCoefficient:
        value.callerCalibratedApertureLogCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
