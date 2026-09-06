import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOilPhaseFlowM3Second: readonly number[];
  readonly observedOilPhaseViscosityPaSeconds: readonly number[];
  readonly observedOilCoreLengthsM: readonly number[];
  readonly callerMatchedOilAbsolutePermeabilityM2: readonly number[];
  readonly observedOilCoreAreasM2: readonly number[];
  readonly observedOilNetPotentialDropsPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly apparentObservedPhaseRelativePermeabilities: readonly number[];
}>;
const inputFields = [
  {
    id: "observedOilPhaseFlowM3Second",
    label: "Observed oil phase flow m3 second",
    kind: "numberList",
  },
  {
    id: "observedOilPhaseViscosityPaSeconds",
    label: "Observed oil phase viscosity pa seconds",
    kind: "numberList",
  },
  {
    id: "observedOilCoreLengthsM",
    label: "Observed oil core lengths m",
    kind: "numberList",
  },
  {
    id: "callerMatchedOilAbsolutePermeabilityM2",
    label: "Caller matched oil absolute permeability m2",
    kind: "numberList",
  },
  {
    id: "observedOilCoreAreasM2",
    label: "Observed oil core areas m2",
    kind: "numberList",
  },
  {
    id: "observedOilNetPotentialDropsPa",
    label: "Observed oil net potential drops pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOilPhaseViscosityPaSeconds.forEach((v) =>
    positive(v, "observedOilPhaseViscosityPaSeconds"),
  );
  input.observedOilCoreLengthsM.forEach((v) =>
    positive(v, "observedOilCoreLengthsM"),
  );
  input.callerMatchedOilAbsolutePermeabilityM2.forEach((v) =>
    positive(v, "callerMatchedOilAbsolutePermeabilityM2"),
  );
  input.observedOilCoreAreasM2.forEach((v) =>
    positive(v, "observedOilCoreAreasM2"),
  );
  input.observedOilNetPotentialDropsPa.forEach((v) =>
    positive(v, "observedOilNetPotentialDropsPa"),
  );
  aligned(
    input.observedOilPhaseFlowM3Second,
    input.observedOilPhaseViscosityPaSeconds,
    "observedOilPhaseFlowM3Second",
  );
  aligned(
    input.observedOilPhaseFlowM3Second,
    input.observedOilCoreLengthsM,
    "observedOilPhaseFlowM3Second",
  );
  aligned(
    input.observedOilPhaseFlowM3Second,
    input.callerMatchedOilAbsolutePermeabilityM2,
    "observedOilPhaseFlowM3Second",
  );
  aligned(
    input.observedOilPhaseFlowM3Second,
    input.observedOilCoreAreasM2,
    "observedOilPhaseFlowM3Second",
  );
  aligned(
    input.observedOilPhaseFlowM3Second,
    input.observedOilNetPotentialDropsPa,
    "observedOilPhaseFlowM3Second",
  );
  return {
    apparentObservedPhaseRelativePermeabilities:
      input.observedOilPhaseFlowM3Second.map(
        (v, i) =>
          (v *
            input.observedOilPhaseViscosityPaSeconds[i] *
            input.observedOilCoreLengthsM[i]) /
          input.callerMatchedOilAbsolutePermeabilityM2[i] /
          input.observedOilCoreAreasM2[i] /
          input.observedOilNetPotentialDropsPa[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOilPhaseFlowM3Second: [1, 2],
  observedOilPhaseViscosityPaSeconds: [1, 1],
  observedOilCoreLengthsM: [1, 1],
  callerMatchedOilAbsolutePermeabilityM2: [1, 1],
  observedOilCoreAreasM2: [1, 1],
  observedOilNetPotentialDropsPa: [2, 4],
} satisfies Input;
export const exampleOutput = {
  apparentObservedPhaseRelativePermeabilities: [0.5, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/relative-permeability-kro",
  title: "Petroleum Relative Permeability Kro Calculator",
  description:
    "Infer actual oil phase relative permeability from matched Darcy core-flow/viscosity/geometry, independently established absolute permeability and net potential drop; negative/>1 apparent measurement evidence retained, no saturation law or experiment recipe. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedOilPhaseFlowM3Second:
        value.observedOilPhaseFlowM3Second as readonly number[],
      observedOilPhaseViscosityPaSeconds:
        value.observedOilPhaseViscosityPaSeconds as readonly number[],
      observedOilCoreLengthsM:
        value.observedOilCoreLengthsM as readonly number[],
      callerMatchedOilAbsolutePermeabilityM2:
        value.callerMatchedOilAbsolutePermeabilityM2 as readonly number[],
      observedOilCoreAreasM2: value.observedOilCoreAreasM2 as readonly number[],
      observedOilNetPotentialDropsPa:
        value.observedOilNetPotentialDropsPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
