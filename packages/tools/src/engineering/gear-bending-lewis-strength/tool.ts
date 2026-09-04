import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerAllowableBendingPa: number;
  readonly faceWidthM: number;
  readonly moduleM: number;
  readonly callerLewisFormFactor: number;
}>;
export type Output = Readonly<{
  readonly nominalLewisTangentialCapacityN: number;
}>;
const inputFields = [
  {
    id: "callerAllowableBendingPa",
    label: "Caller allowable bending pa",
    kind: "number",
  },
  { id: "faceWidthM", label: "Face width m", kind: "number" },
  { id: "moduleM", label: "Module m", kind: "number" },
  {
    id: "callerLewisFormFactor",
    label: "Caller lewis form factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerAllowableBendingPa, "callerAllowableBendingPa");
  positive(input.faceWidthM, "faceWidthM");
  positive(input.moduleM, "moduleM");
  positive(input.callerLewisFormFactor, "callerLewisFormFactor");
  return {
    nominalLewisTangentialCapacityN:
      input.callerAllowableBendingPa *
      input.faceWidthM *
      input.moduleM *
      input.callerLewisFormFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAllowableBendingPa: 100,
  faceWidthM: 2,
  moduleM: 0.1,
  callerLewisFormFactor: 0.3,
} satisfies Input;
export const exampleOutput = {
  nominalLewisTangentialCapacityN: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/gear-bending-lewis-strength",
  title: "Lewis Gear Bending Strength Calculator",
  description:
    "Lewis Ft=σallow b m Y, caller Y uses MODULE convention not circular-pitch convention, dynamic/root factors not inferred. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "nominalLewisTangentialCapacityN",
      label: "Nominal lewis tangential capacity n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAllowableBendingPa: value.callerAllowableBendingPa as number,
      faceWidthM: value.faceWidthM as number,
      moduleM: value.moduleM as number,
      callerLewisFormFactor: value.callerLewisFormFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
