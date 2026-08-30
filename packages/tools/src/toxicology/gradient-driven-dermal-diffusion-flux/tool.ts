import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly permeabilityCmPerHour: number;
  readonly donorConcentrationMgPerCubicCm: number;
  readonly receiverConcentrationMgPerCubicCm: number;
  readonly areaSquareCm: number;
  readonly exposureHours: number;
}>;
export type Output = Readonly<{
  readonly signedFluxMgPerSquareCmHour: number;
  readonly netTransferredMassMg: number;
}>;
const inputFields = [
  {
    id: "permeabilityCmPerHour",
    label: "Permeability cm per hour",
    kind: "number",
  },
  {
    id: "donorConcentrationMgPerCubicCm",
    label: "Donor concentration mg per cubic cm",
    kind: "number",
  },
  {
    id: "receiverConcentrationMgPerCubicCm",
    label: "Receiver concentration mg per cubic cm",
    kind: "number",
  },
  { id: "areaSquareCm", label: "Area square cm", kind: "number" },
  { id: "exposureHours", label: "Exposure hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.permeabilityCmPerHour, "permeabilityCmPerHour");
  nonnegative(
    input.donorConcentrationMgPerCubicCm,
    "donorConcentrationMgPerCubicCm",
  );
  nonnegative(
    input.receiverConcentrationMgPerCubicCm,
    "receiverConcentrationMgPerCubicCm",
  );
  nonnegative(input.areaSquareCm, "areaSquareCm");
  nonnegative(input.exposureHours, "exposureHours");
  const signedFluxMgPerSquareCmHour =
    input.permeabilityCmPerHour *
    (input.donorConcentrationMgPerCubicCm -
      input.receiverConcentrationMgPerCubicCm);
  return {
    signedFluxMgPerSquareCmHour,
    netTransferredMassMg:
      signedFluxMgPerSquareCmHour * input.areaSquareCm * input.exposureHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  permeabilityCmPerHour: 0.1,
  donorConcentrationMgPerCubicCm: 2,
  receiverConcentrationMgPerCubicCm: 0.5,
  areaSquareCm: 10,
  exposureHours: 2,
} satisfies Input;
export const exampleOutput = {
  signedFluxMgPerSquareCmHour: 0.15,
  netTransferredMassMg: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/gradient-driven-dermal-diffusion-flux",
  title: "Dermal Flux",
  description:
    "Calculate signed steady concentration-gradient dermal flux and net transfer; depletion, lag time, finite-dose skin storage and metabolism are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedFluxMgPerSquareCmHour",
      label: "Signed flux mg per square cm hour",
      kind: "number",
    },
    {
      id: "netTransferredMassMg",
      label: "Net transferred mass mg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      permeabilityCmPerHour: value.permeabilityCmPerHour as number,
      donorConcentrationMgPerCubicCm:
        value.donorConcentrationMgPerCubicCm as number,
      receiverConcentrationMgPerCubicCm:
        value.receiverConcentrationMgPerCubicCm as number,
      areaSquareCm: value.areaSquareCm as number,
      exposureHours: value.exposureHours as number,
    }),
});
export const run = tool.execute;
export default tool;
