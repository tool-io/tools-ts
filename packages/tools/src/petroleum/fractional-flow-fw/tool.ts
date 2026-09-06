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
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerMatchedWaterRelativePermeability: number;
  readonly callerMatchedOilRelativePermeability: number;
  readonly observedWaterViscosityPaSeconds: number;
  readonly observedOilViscosityPaSeconds: number;
  readonly callerNoGravityCapillaryFractionalFlowBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly modelWaterFractionalFlow: number;
  readonly modelOilFractionalFlow: number;
}>;
const inputFields = [
  {
    id: "callerMatchedWaterRelativePermeability",
    label: "Caller matched water relative permeability",
    kind: "number",
  },
  {
    id: "callerMatchedOilRelativePermeability",
    label: "Caller matched oil relative permeability",
    kind: "number",
  },
  {
    id: "observedWaterViscosityPaSeconds",
    label: "Observed water viscosity pa seconds",
    kind: "number",
  },
  {
    id: "observedOilViscosityPaSeconds",
    label: "Observed oil viscosity pa seconds",
    kind: "number",
  },
  {
    id: "callerNoGravityCapillaryFractionalFlowBranchVerified",
    label: "Caller no gravity capillary fractional flow branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedWaterViscosityPaSeconds,
    "observedWaterViscosityPaSeconds",
  );
  positive(
    input.observedOilViscosityPaSeconds,
    "observedOilViscosityPaSeconds",
  );
  fraction(
    input.callerMatchedWaterRelativePermeability,
    "callerMatchedWaterRelativePermeability",
  );
  fraction(
    input.callerMatchedOilRelativePermeability,
    "callerMatchedOilRelativePermeability",
  );
  if (!input.callerNoGravityCapillaryFractionalFlowBranchVerified)
    simpleError(
      "branch",
      "Independent shared-permeability no gravity/capillary-gradient two-phase branch required.",
    );
  const w =
      input.callerMatchedWaterRelativePermeability /
      input.observedWaterViscosityPaSeconds,
    o =
      input.callerMatchedOilRelativePermeability /
      input.observedOilViscosityPaSeconds;
  positive(w + o, "total mobility");
  return {
    modelWaterFractionalFlow: w / (w + o),
    modelOilFractionalFlow: o / (w + o),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedWaterRelativePermeability: 0.2,
  callerMatchedOilRelativePermeability: 0.8,
  observedWaterViscosityPaSeconds: 1,
  observedOilViscosityPaSeconds: 2,
  callerNoGravityCapillaryFractionalFlowBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  modelWaterFractionalFlow: 0.3333333333333333,
  modelOilFractionalFlow: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/fractional-flow-fw",
  title: "Petroleum Fractional Flow Fw Calculator",
  description:
    "Named two-phase mobility fractional flow, explicit independently matched relative permeabilities/viscosities and no gravity/capillary gradient, not actual produced water cut or generic mass fraction. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelWaterFractionalFlow",
      label: "Model water fractional flow",
      kind: "number",
    },
    {
      id: "modelOilFractionalFlow",
      label: "Model oil fractional flow",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedWaterRelativePermeability:
        value.callerMatchedWaterRelativePermeability as number,
      callerMatchedOilRelativePermeability:
        value.callerMatchedOilRelativePermeability as number,
      observedWaterViscosityPaSeconds:
        value.observedWaterViscosityPaSeconds as number,
      observedOilViscosityPaSeconds:
        value.observedOilViscosityPaSeconds as number,
      callerNoGravityCapillaryFractionalFlowBranchVerified:
        value.callerNoGravityCapillaryFractionalFlowBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
