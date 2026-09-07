import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedOrganicSubstrateMeasuredCapacitanceFarads: readonly number[];
  readonly observedIndependentFixtureCapacitanceFarads: readonly number[];
  readonly observedSubstrateThicknessM: readonly number[];
  readonly observedElectrodeAreasM2: readonly number[];
  readonly callerVacuumPermittivityFM: number;
}>;
export type Output = Readonly<{
  readonly inferredOrganicRelativePermittivities: readonly number[];
}>;
const inputFields = [
  {
    id: "observedOrganicSubstrateMeasuredCapacitanceFarads",
    label: "Observed organic substrate measured capacitance farads",
    kind: "numberList",
  },
  {
    id: "observedIndependentFixtureCapacitanceFarads",
    label: "Observed independent fixture capacitance farads",
    kind: "numberList",
  },
  {
    id: "observedSubstrateThicknessM",
    label: "Observed substrate thickness m",
    kind: "numberList",
  },
  {
    id: "observedElectrodeAreasM2",
    label: "Observed electrode areas m2",
    kind: "numberList",
  },
  {
    id: "callerVacuumPermittivityFM",
    label: "Caller vacuum permittivity f m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOrganicSubstrateMeasuredCapacitanceFarads.forEach((v) =>
    positive(v, "observedOrganicSubstrateMeasuredCapacitanceFarads"),
  );
  input.observedSubstrateThicknessM.forEach((v) =>
    positive(v, "observedSubstrateThicknessM"),
  );
  input.observedElectrodeAreasM2.forEach((v) =>
    positive(v, "observedElectrodeAreasM2"),
  );
  positive(input.callerVacuumPermittivityFM, "callerVacuumPermittivityFM");
  input.observedIndependentFixtureCapacitanceFarads.forEach((v) =>
    nonnegative(v, "observedIndependentFixtureCapacitanceFarads"),
  );
  aligned(
    input.observedOrganicSubstrateMeasuredCapacitanceFarads,
    input.observedIndependentFixtureCapacitanceFarads,
    "observedOrganicSubstrateMeasuredCapacitanceFarads",
  );
  aligned(
    input.observedOrganicSubstrateMeasuredCapacitanceFarads,
    input.observedSubstrateThicknessM,
    "observedOrganicSubstrateMeasuredCapacitanceFarads",
  );
  aligned(
    input.observedOrganicSubstrateMeasuredCapacitanceFarads,
    input.observedElectrodeAreasM2,
    "observedOrganicSubstrateMeasuredCapacitanceFarads",
  );
  return {
    inferredOrganicRelativePermittivities:
      input.observedOrganicSubstrateMeasuredCapacitanceFarads.map(
        (v, i) =>
          ((v - input.observedIndependentFixtureCapacitanceFarads[i]) *
            input.observedSubstrateThicknessM[i]) /
          input.callerVacuumPermittivityFM /
          input.observedElectrodeAreasM2[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOrganicSubstrateMeasuredCapacitanceFarads: [2, 3],
  observedIndependentFixtureCapacitanceFarads: [0.5, 1],
  observedSubstrateThicknessM: [1, 2],
  observedElectrodeAreasM2: [1, 2],
  callerVacuumPermittivityFM: 1,
} satisfies Input;
export const exampleOutput = {
  inferredOrganicRelativePermittivities: [1.5, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/organic-substrate-dielectric-constant",
  title: "Semiconductor Organic Substrate Dielectric Constant Calculator",
  description:
    "Invert actual organic substrate plate capacitance after independent fixture subtraction, signed calibration mismatch retained; not forward plate capacitance or universal dielectric constant.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredOrganicRelativePermittivities",
      label: "Inferred organic relative permittivities",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOrganicSubstrateMeasuredCapacitanceFarads:
        value.observedOrganicSubstrateMeasuredCapacitanceFarads as readonly number[],
      observedIndependentFixtureCapacitanceFarads:
        value.observedIndependentFixtureCapacitanceFarads as readonly number[],
      observedSubstrateThicknessM:
        value.observedSubstrateThicknessM as readonly number[],
      observedElectrodeAreasM2:
        value.observedElectrodeAreasM2 as readonly number[],
      callerVacuumPermittivityFM: value.callerVacuumPermittivityFM as number,
    }),
});
export const run = tool.execute;
export default tool;
