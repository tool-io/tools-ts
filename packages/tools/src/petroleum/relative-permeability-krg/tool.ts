import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedGasPhaseFlowM3Second: readonly number[];
  readonly observedGasPhaseViscosityPaSeconds: readonly number[];
  readonly observedGasCoreLengthsM: readonly number[];
  readonly callerMatchedGasAbsolutePermeabilityM2: readonly number[];
  readonly observedGasCoreAreasM2: readonly number[];
  readonly observedGasNetPotentialDropsPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly apparentObservedPhaseRelativePermeabilities: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGasPhaseFlowM3Second",
    label: "Observed gas phase flow m3 second",
    kind: "numberList",
  },
  {
    id: "observedGasPhaseViscosityPaSeconds",
    label: "Observed gas phase viscosity pa seconds",
    kind: "numberList",
  },
  {
    id: "observedGasCoreLengthsM",
    label: "Observed gas core lengths m",
    kind: "numberList",
  },
  {
    id: "callerMatchedGasAbsolutePermeabilityM2",
    label: "Caller matched gas absolute permeability m2",
    kind: "numberList",
  },
  {
    id: "observedGasCoreAreasM2",
    label: "Observed gas core areas m2",
    kind: "numberList",
  },
  {
    id: "observedGasNetPotentialDropsPa",
    label: "Observed gas net potential drops pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGasPhaseViscosityPaSeconds.forEach((v) =>
    positive(v, "observedGasPhaseViscosityPaSeconds"),
  );
  input.observedGasCoreLengthsM.forEach((v) =>
    positive(v, "observedGasCoreLengthsM"),
  );
  input.callerMatchedGasAbsolutePermeabilityM2.forEach((v) =>
    positive(v, "callerMatchedGasAbsolutePermeabilityM2"),
  );
  input.observedGasCoreAreasM2.forEach((v) =>
    positive(v, "observedGasCoreAreasM2"),
  );
  input.observedGasNetPotentialDropsPa.forEach((v) =>
    positive(v, "observedGasNetPotentialDropsPa"),
  );
  aligned(
    input.observedGasPhaseFlowM3Second,
    input.observedGasPhaseViscosityPaSeconds,
    "observedGasPhaseFlowM3Second",
  );
  aligned(
    input.observedGasPhaseFlowM3Second,
    input.observedGasCoreLengthsM,
    "observedGasPhaseFlowM3Second",
  );
  aligned(
    input.observedGasPhaseFlowM3Second,
    input.callerMatchedGasAbsolutePermeabilityM2,
    "observedGasPhaseFlowM3Second",
  );
  aligned(
    input.observedGasPhaseFlowM3Second,
    input.observedGasCoreAreasM2,
    "observedGasPhaseFlowM3Second",
  );
  aligned(
    input.observedGasPhaseFlowM3Second,
    input.observedGasNetPotentialDropsPa,
    "observedGasPhaseFlowM3Second",
  );
  return {
    apparentObservedPhaseRelativePermeabilities:
      input.observedGasPhaseFlowM3Second.map(
        (v, i) =>
          (v *
            input.observedGasPhaseViscosityPaSeconds[i] *
            input.observedGasCoreLengthsM[i]) /
          input.callerMatchedGasAbsolutePermeabilityM2[i] /
          input.observedGasCoreAreasM2[i] /
          input.observedGasNetPotentialDropsPa[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGasPhaseFlowM3Second: [1, 2],
  observedGasPhaseViscosityPaSeconds: [1, 1],
  observedGasCoreLengthsM: [1, 1],
  callerMatchedGasAbsolutePermeabilityM2: [1, 1],
  observedGasCoreAreasM2: [1, 1],
  observedGasNetPotentialDropsPa: [2, 4],
} satisfies Input;
export const exampleOutput = {
  apparentObservedPhaseRelativePermeabilities: [0.5, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/relative-permeability-krg",
  title: "Petroleum Relative Permeability Krg Calculator",
  description:
    "Infer actual gas phase relative permeability from matched Darcy core-flow/viscosity/geometry, independently established absolute permeability and net potential drop; negative/>1 apparent measurement evidence retained, no saturation law or experiment recipe. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentObservedPhaseRelativePermeabilities",
      label: "Apparent observed phase relative permeabilities",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGasPhaseFlowM3Second:
        value.observedGasPhaseFlowM3Second as readonly number[],
      observedGasPhaseViscosityPaSeconds:
        value.observedGasPhaseViscosityPaSeconds as readonly number[],
      observedGasCoreLengthsM:
        value.observedGasCoreLengthsM as readonly number[],
      callerMatchedGasAbsolutePermeabilityM2:
        value.callerMatchedGasAbsolutePermeabilityM2 as readonly number[],
      observedGasCoreAreasM2: value.observedGasCoreAreasM2 as readonly number[],
      observedGasNetPotentialDropsPa:
        value.observedGasNetPotentialDropsPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
