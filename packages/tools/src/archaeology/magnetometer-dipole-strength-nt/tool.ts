import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedAxialFieldNt: number;
  readonly independentAxialDistanceMeters: number;
  readonly callerMediumPermeabilityHenryPerMeter: number;
}>;
export type Output = Readonly<{
  readonly idealAxialDipoleMomentAmpereM2: number;
}>;
const inputFields = [
  {
    id: "observedAxialFieldNt",
    label: "Observed axial field nt",
    kind: "number",
  },
  {
    id: "independentAxialDistanceMeters",
    label: "Independent axial distance meters",
    kind: "number",
  },
  {
    id: "callerMediumPermeabilityHenryPerMeter",
    label: "Caller medium permeability henry per meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentAxialDistanceMeters,
    "independentAxialDistanceMeters",
  );
  positive(
    input.callerMediumPermeabilityHenryPerMeter,
    "callerMediumPermeabilityHenryPerMeter",
  );
  return {
    idealAxialDipoleMomentAmpereM2:
      (input.observedAxialFieldNt *
        1e-9 *
        2 *
        Math.PI *
        input.independentAxialDistanceMeters ** 3) /
      input.callerMediumPermeabilityHenryPerMeter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAxialFieldNt: 200,
  independentAxialDistanceMeters: 2,
  callerMediumPermeabilityHenryPerMeter: 1.2566370614359173e-6,
} satisfies Input;
export const exampleOutput = {
  idealAxialDipoleMomentAmpereM2: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/magnetometer-dipole-strength-nt",
  title: "Magnetometer Dipole Strength nT Tool",
  description:
    "Ideal point dipole AXIAL field inversion B=μm/(2πr³), signed moment retained; not buried source identity, off axis estimate or geomagnetic background inference. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealAxialDipoleMomentAmpereM2",
      label: "Ideal axial dipole moment ampere m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAxialFieldNt: value.observedAxialFieldNt as number,
      independentAxialDistanceMeters:
        value.independentAxialDistanceMeters as number,
      callerMediumPermeabilityHenryPerMeter:
        value.callerMediumPermeabilityHenryPerMeter as number,
    }),
});
export const run = tool.execute;
export default tool;
