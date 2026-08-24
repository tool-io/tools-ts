import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ImplantProjectedRangeInput = {
  readonly ionEnergyKev: number;
  readonly rangeCoefficientNmPerKev: number;
};

export type ImplantProjectedRangeOutput = {
  readonly projectedRangeNm: number;
};

export const implantProjectedRangeExample = {
  input: { ionEnergyKev: 100, rangeCoefficientNmPerKev: 1 },
  output: { projectedRangeNm: 100 },
} satisfies ToolExample<
  ImplantProjectedRangeInput,
  ImplantProjectedRangeOutput
>;

export const implantProjectedRangeTool = createSimpleTool({
  calculate: (input) => {
    const projectedRangeNm =
      (input.rangeCoefficientNmPerKev as number) *
      (input.ionEnergyKev as number);
    if (!Number.isFinite(projectedRangeNm) || projectedRangeNm <= 0)
      simpleError(
        "ionEnergyKev",
        "The projected range is outside the representable range.",
        "numeric_range",
      );
    return { projectedRangeNm };
  },
  description:
    "Compute the ion implantation projected range by scaling the implant energy with a range coefficient.",
  id: "semiconductor/ion-implantation-projected-range",
  inputs: [
    {
      description: "Kinetic energy of the implanted ion.",
      id: "ionEnergyKev",
      kind: "number",
      label: "Ion energy",
      maximum: 5000,
      minimum: 1,
      unit: "keV",
    },
    {
      description:
        "Projected range per unit energy for the ion and target material.",
      id: "rangeCoefficientNmPerKev",
      kind: "number",
      label: "Range coefficient",
      minimum: Number.MIN_VALUE,
      unit: "nm/keV",
    },
  ],
  outputs: [
    {
      description: "Mean depth of the implanted profile.",
      id: "projectedRangeNm",
      kind: "number",
      label: "Projected range",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  title: "Implant Projected Range Calculator",
});
export const runImplantProjectedRange = implantProjectedRangeTool.execute;
export default implantProjectedRangeTool;
