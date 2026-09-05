import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedAdvectedAirDewpointC: number;
  readonly observedSeaSurfaceC: number;
  readonly callerContactCoolingEfficiency: number;
}>;
export type Output = Readonly<{
  readonly signedDewpointSeaDeltaC: number;
  readonly conditionalContactSaturationMarginC: number;
}>;
const inputFields = [
  {
    id: "observedAdvectedAirDewpointC",
    label: "Observed advected air dewpoint c",
    kind: "number",
  },
  {
    id: "observedSeaSurfaceC",
    label: "Observed sea surface c",
    kind: "number",
  },
  {
    id: "callerContactCoolingEfficiency",
    label: "Caller contact cooling efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(
    input.callerContactCoolingEfficiency,
    "callerContactCoolingEfficiency",
  );
  const d = input.observedAdvectedAirDewpointC - input.observedSeaSurfaceC;
  return {
    signedDewpointSeaDeltaC: d,
    conditionalContactSaturationMarginC:
      d * input.callerContactCoolingEfficiency,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAdvectedAirDewpointC: 15,
  observedSeaSurfaceC: 10,
  callerContactCoolingEfficiency: 0.5,
} satisfies Input;
export const exampleOutput = {
  signedDewpointSeaDeltaC: 5,
  conditionalContactSaturationMarginC: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/advection-fog-sea-delta-checker",
  title: "Advection Fog Sea Delta Checker",
  description:
    "Air dewpoint−sea temperature contact-cooling screen with explicit efficiency; fog/visibility not established without mixing trajectory and moisture evidence. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedDewpointSeaDeltaC",
      label: "Signed dewpoint sea delta c",
      kind: "number",
    },
    {
      id: "conditionalContactSaturationMarginC",
      label: "Conditional contact saturation margin c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAdvectedAirDewpointC:
        value.observedAdvectedAirDewpointC as number,
      observedSeaSurfaceC: value.observedSeaSurfaceC as number,
      callerContactCoolingEfficiency:
        value.callerContactCoolingEfficiency as number,
    }),
});
export const run = tool.execute;
export default tool;
