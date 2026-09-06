import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedWaterPhaseFlowM3Second: readonly number[];
  readonly observedWaterPhaseViscosityPaSeconds: readonly number[];
  readonly observedWaterCoreLengthsM: readonly number[];
  readonly callerMatchedWaterAbsolutePermeabilityM2: readonly number[];
  readonly observedWaterCoreAreasM2: readonly number[];
  readonly observedWaterNetPotentialDropsPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly apparentObservedPhaseRelativePermeabilities: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWaterPhaseFlowM3Second",
    label: "Observed water phase flow m3 second",
    kind: "numberList",
  },
  {
    id: "observedWaterPhaseViscosityPaSeconds",
    label: "Observed water phase viscosity pa seconds",
    kind: "numberList",
  },
  {
    id: "observedWaterCoreLengthsM",
    label: "Observed water core lengths m",
    kind: "numberList",
  },
  {
    id: "callerMatchedWaterAbsolutePermeabilityM2",
    label: "Caller matched water absolute permeability m2",
    kind: "numberList",
  },
  {
    id: "observedWaterCoreAreasM2",
    label: "Observed water core areas m2",
    kind: "numberList",
  },
  {
    id: "observedWaterNetPotentialDropsPa",
    label: "Observed water net potential drops pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWaterPhaseViscosityPaSeconds.forEach((v) =>
    positive(v, "observedWaterPhaseViscosityPaSeconds"),
  );
  input.observedWaterCoreLengthsM.forEach((v) =>
    positive(v, "observedWaterCoreLengthsM"),
  );
  input.callerMatchedWaterAbsolutePermeabilityM2.forEach((v) =>
    positive(v, "callerMatchedWaterAbsolutePermeabilityM2"),
  );
  input.observedWaterCoreAreasM2.forEach((v) =>
    positive(v, "observedWaterCoreAreasM2"),
  );
  input.observedWaterNetPotentialDropsPa.forEach((v) =>
    positive(v, "observedWaterNetPotentialDropsPa"),
  );
  aligned(
    input.observedWaterPhaseFlowM3Second,
    input.observedWaterPhaseViscosityPaSeconds,
    "observedWaterPhaseFlowM3Second",
  );
  aligned(
    input.observedWaterPhaseFlowM3Second,
    input.observedWaterCoreLengthsM,
    "observedWaterPhaseFlowM3Second",
  );
  aligned(
    input.observedWaterPhaseFlowM3Second,
    input.callerMatchedWaterAbsolutePermeabilityM2,
    "observedWaterPhaseFlowM3Second",
  );
  aligned(
    input.observedWaterPhaseFlowM3Second,
    input.observedWaterCoreAreasM2,
    "observedWaterPhaseFlowM3Second",
  );
  aligned(
    input.observedWaterPhaseFlowM3Second,
    input.observedWaterNetPotentialDropsPa,
    "observedWaterPhaseFlowM3Second",
  );
  return {
    apparentObservedPhaseRelativePermeabilities:
      input.observedWaterPhaseFlowM3Second.map(
        (v, i) =>
          (v *
            input.observedWaterPhaseViscosityPaSeconds[i] *
            input.observedWaterCoreLengthsM[i]) /
          input.callerMatchedWaterAbsolutePermeabilityM2[i] /
          input.observedWaterCoreAreasM2[i] /
          input.observedWaterNetPotentialDropsPa[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWaterPhaseFlowM3Second: [1, 2],
  observedWaterPhaseViscosityPaSeconds: [1, 1],
  observedWaterCoreLengthsM: [1, 1],
  callerMatchedWaterAbsolutePermeabilityM2: [1, 1],
  observedWaterCoreAreasM2: [1, 1],
  observedWaterNetPotentialDropsPa: [2, 4],
} satisfies Input;
export const exampleOutput = {
  apparentObservedPhaseRelativePermeabilities: [0.5, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/relative-permeability-krw",
  title: "Petroleum Relative Permeability Krw Calculator",
  description:
    "Infer actual water phase relative permeability from matched Darcy core-flow/viscosity/geometry, independently established absolute permeability and net potential drop; negative/>1 apparent measurement evidence retained, no saturation law or experiment recipe. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedWaterPhaseFlowM3Second:
        value.observedWaterPhaseFlowM3Second as readonly number[],
      observedWaterPhaseViscosityPaSeconds:
        value.observedWaterPhaseViscosityPaSeconds as readonly number[],
      observedWaterCoreLengthsM:
        value.observedWaterCoreLengthsM as readonly number[],
      callerMatchedWaterAbsolutePermeabilityM2:
        value.callerMatchedWaterAbsolutePermeabilityM2 as readonly number[],
      observedWaterCoreAreasM2:
        value.observedWaterCoreAreasM2 as readonly number[],
      observedWaterNetPotentialDropsPa:
        value.observedWaterNetPotentialDropsPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
