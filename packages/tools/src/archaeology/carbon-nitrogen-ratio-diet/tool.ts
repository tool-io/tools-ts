import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly carbonMassPercent: number;
  readonly nitrogenMassPercent: number;
  readonly carbonAtomicMass: number;
  readonly nitrogenAtomicMass: number;
  readonly callerAtomicRatioBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly atomicCarbonNitrogenRatio: number;
  readonly withinCallerPreservationBand: boolean;
}>;
const inputFields = [
  { id: "carbonMassPercent", label: "Carbon mass percent", kind: "number" },
  { id: "nitrogenMassPercent", label: "Nitrogen mass percent", kind: "number" },
  { id: "carbonAtomicMass", label: "Carbon atomic mass", kind: "number" },
  { id: "nitrogenAtomicMass", label: "Nitrogen atomic mass", kind: "number" },
  {
    id: "callerAtomicRatioBounds",
    label: "Caller atomic ratio bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.nitrogenMassPercent, "nitrogenMassPercent");
  positive(input.carbonAtomicMass, "carbonAtomicMass");
  positive(input.nitrogenAtomicMass, "nitrogenAtomicMass");
  nonnegative(input.carbonMassPercent, "carbonMassPercent");
  input.callerAtomicRatioBounds.forEach((v) =>
    nonnegative(v, "callerAtomicRatioBounds"),
  );
  if (
    input.carbonMassPercent + input.nitrogenMassPercent > 100 ||
    input.callerAtomicRatioBounds.length !== 2 ||
    input.callerAtomicRatioBounds[0] > input.callerAtomicRatioBounds[1]
  )
    simpleError(
      "composition",
      "Mass percentages sum at most 100 and ordered two-bound ratio band required.",
    );
  const atomicCarbonNitrogenRatio =
    input.carbonMassPercent /
    input.carbonAtomicMass /
    (input.nitrogenMassPercent / input.nitrogenAtomicMass);
  return {
    atomicCarbonNitrogenRatio,
    withinCallerPreservationBand:
      atomicCarbonNitrogenRatio >= input.callerAtomicRatioBounds[0] &&
      atomicCarbonNitrogenRatio <= input.callerAtomicRatioBounds[1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  carbonMassPercent: 36,
  nitrogenMassPercent: 12,
  carbonAtomicMass: 12,
  nitrogenAtomicMass: 14,
  callerAtomicRatioBounds: [3, 4],
} satisfies Input;
export const exampleOutput = {
  atomicCarbonNitrogenRatio: 3.5,
  withinCallerPreservationBand: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/carbon-nitrogen-ratio-diet",
  title: "C:N Ratio Diet Indicator",
  description:
    "Convert measured C/N mass percentages to atomic ratio and caller collagen-preservation screen; this ratio is not a diet determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "atomicCarbonNitrogenRatio",
      label: "Atomic carbon nitrogen ratio",
      kind: "number",
    },
    {
      id: "withinCallerPreservationBand",
      label: "Within caller preservation band",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      carbonMassPercent: value.carbonMassPercent as number,
      nitrogenMassPercent: value.nitrogenMassPercent as number,
      carbonAtomicMass: value.carbonAtomicMass as number,
      nitrogenAtomicMass: value.nitrogenAtomicMass as number,
      callerAtomicRatioBounds:
        value.callerAtomicRatioBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
