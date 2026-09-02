import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly whiteDwarfMassSolar: number;
  readonly callerElectronMolecularWeight: number;
}>;
export type Output = Readonly<{
  readonly idealChandrasekharMassSolar: number;
  readonly signedIdealMassReserveSolar: number;
}>;
const inputFields = [
  {
    id: "whiteDwarfMassSolar",
    label: "White dwarf mass solar",
    kind: "number",
  },
  {
    id: "callerElectronMolecularWeight",
    label: "Caller electron molecular weight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerElectronMolecularWeight,
    "callerElectronMolecularWeight",
  );
  nonnegative(input.whiteDwarfMassSolar, "whiteDwarfMassSolar");
  return {
    idealChandrasekharMassSolar:
      5.83 / input.callerElectronMolecularWeight ** 2,
    signedIdealMassReserveSolar:
      5.83 / input.callerElectronMolecularWeight ** 2 -
      input.whiteDwarfMassSolar,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  whiteDwarfMassSolar: 1,
  callerElectronMolecularWeight: 2,
} satisfies Input;
export const exampleOutput = {
  idealChandrasekharMassSolar: 1.4575,
  signedIdealMassReserveSolar: 0.4575,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/chandrasekhar-limit-checker",
  title: "Chandrasekhar Limit Checker",
  description:
    "Ideal zero-temperature relativistic electron-degenerate Chandrasekhar 5.83/μe²mass proxy; not exp los ion, rotation or actual stability prediction. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealChandrasekharMassSolar",
      label: "Ideal chandrasekhar mass solar",
      kind: "number",
    },
    {
      id: "signedIdealMassReserveSolar",
      label: "Signed ideal mass reserve solar",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      whiteDwarfMassSolar: value.whiteDwarfMassSolar as number,
      callerElectronMolecularWeight:
        value.callerElectronMolecularWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
