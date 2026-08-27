import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const volumeDistributionApparentExample = {
  input: { doseMg: 100, plasmaConcMgL: 4 },
  output: { apparentVolumeL: 25 },
} satisfies ToolExample<
  {
    readonly bioavailabilityFraction?: number;
    readonly doseMg: number;
    readonly plasmaConcMgL: number;
  },
  { readonly apparentVolumeL: number }
>;

export const volumeDistributionApparentTool = createSimpleTool({
  id: "biology/volume-distribution-apparent",
  title: "Apparent Vd",
  description:
    "Estimate volume of distribution as the systemically available dose (administered dose times bioavailability) divided by plasma concentration.",
  inputs: [
    {
      description:
        "Administered dose in milligrams; must be greater than zero.",
      id: "doseMg",
      label: "Dose",
      kind: "number",
      unit: "mg",
    },
    {
      description:
        "Measured plasma concentration in milligrams per litre; must be greater than zero.",
      id: "plasmaConcMgL",
      label: "Plasma concentration",
      kind: "number",
      unit: "mg/L",
    },
    {
      default: 1,
      description:
        "Bioavailability fraction between zero and one; defaults to complete bioavailability.",
      id: "bioavailabilityFraction",
      label: "Bioavailability fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Apparent volume of distribution in litres.",
      id: "apparentVolumeL",
      label: "Apparent volume of distribution",
      kind: "number",
      unit: "L",
    },
  ],
  calculate: (input) => {
    const doseMg = input.doseMg as number;
    const plasmaConcMgL = input.plasmaConcMgL as number;
    const bioavailabilityFraction = input.bioavailabilityFraction as number;
    if (!(doseMg > 0))
      simpleError(
        "doseMg",
        "The dose must be greater than zero.",
        "invalid_dose",
      );
    if (!(plasmaConcMgL > 0))
      simpleError(
        "plasmaConcMgL",
        "The plasma concentration must be greater than zero.",
        "invalid_concentration",
      );
    if (!(bioavailabilityFraction > 0) || bioavailabilityFraction > 1)
      simpleError(
        "bioavailabilityFraction",
        "The bioavailability fraction must be strictly between zero and one.",
        "invalid_fraction",
      );
    return {
      apparentVolumeL: (doseMg * bioavailabilityFraction) / plasmaConcMgL,
    };
  },
});
export const runVolumeDistributionApparent =
  volumeDistributionApparentTool.execute;
export default volumeDistributionApparentTool;
