import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  integral,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedConversionFractions: readonly number[];
  readonly callerMatchedInverseReactionRatesM3SecondMol: readonly number[];
  readonly inletReactantMolSecond: number;
}>;
export type Output = Readonly<{ readonly pfrIntegratedVolumeM3: number }>;
const inputFields = [
  {
    id: "observedConversionFractions",
    label: "Observed conversion fractions",
    kind: "numberList",
  },
  {
    id: "callerMatchedInverseReactionRatesM3SecondMol",
    label: "Caller matched inverse reaction rates m3 second mol",
    kind: "numberList",
  },
  {
    id: "inletReactantMolSecond",
    label: "Inlet reactant mol second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedInverseReactionRatesM3SecondMol.forEach((v) =>
    positive(v, "callerMatchedInverseReactionRatesM3SecondMol"),
  );
  positive(input.inletReactantMolSecond, "inletReactantMolSecond");
  input.observedConversionFractions.forEach((v) =>
    fraction(v, "observedConversionFractions"),
  );
  if (input.observedConversionFractions[0] !== 0)
    simpleError(
      "conversion",
      "Actual calibration beginsX=0; no rate extrapolation.",
    );
  return {
    pfrIntegratedVolumeM3:
      input.inletReactantMolSecond *
      integral(
        input.observedConversionFractions,
        input.callerMatchedInverseReactionRatesM3SecondMol,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConversionFractions: [0, 0.5, 1],
  callerMatchedInverseReactionRatesM3SecondMol: [1, 2, 3],
  inletReactantMolSecond: 2,
} satisfies Input;
export const exampleOutput = { pfrIntegratedVolumeM3: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/pfr-volume",
  title: "PFR Volume Calculator",
  description:
    "Isothermal constant-molar-inlet PFR design integral F_A0∫dX/(−r_A), independently matched inverse-rate curve, not CSTR residence time. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "pfrIntegratedVolumeM3",
      label: "Pfr integrated volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConversionFractions:
        value.observedConversionFractions as readonly number[],
      callerMatchedInverseReactionRatesM3SecondMol:
        value.callerMatchedInverseReactionRatesM3SecondMol as readonly number[],
      inletReactantMolSecond: value.inletReactantMolSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
