import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PulmonaryVascularResistanceInput = {
  readonly meanPapMmhg: number;
  readonly leftAtrialMmhg: number;
  readonly cardiacOutputLPerMin: number;
};

export type PulmonaryVascularResistanceOutput = {
  readonly pvrWoodUnits: number;
};

export const pulmonaryVascularResistanceExample = {
  input: { meanPapMmhg: 15, leftAtrialMmhg: 5, cardiacOutputLPerMin: 5 },
  output: { pvrWoodUnits: 2 },
} satisfies ToolExample<
  PulmonaryVascularResistanceInput,
  PulmonaryVascularResistanceOutput
>;

export const pulmonaryVascularResistanceTool = createSimpleTool({
  id: "biology/pulmonary-vascular-resistance",
  title: "PVR Calculator",
  description:
    "Compute pulmonary vascular resistance from mean PAP, left atrial pressure, and cardiac output.",
  inputs: [
    {
      id: "meanPapMmhg",
      kind: "number",
      label: "Mean pulmonary artery pressure",
      unit: "mmHg",
    },
    {
      id: "leftAtrialMmhg",
      kind: "number",
      label: "Left atrial pressure",
      unit: "mmHg",
    },
    {
      id: "cardiacOutputLPerMin",
      kind: "number",
      label: "Cardiac output",
      minimum: Number.MIN_VALUE,
      unit: "L/min",
    },
  ],
  outputs: [
    {
      id: "pvrWoodUnits",
      kind: "number",
      label: "Pulmonary vascular resistance",
      unit: "Wood units",
    },
  ],
  calculate: (input) => {
    const meanPapMmhg = input.meanPapMmhg as number;
    const leftAtrialMmhg = input.leftAtrialMmhg as number;
    if (meanPapMmhg < leftAtrialMmhg)
      simpleError(
        "meanPapMmhg",
        "Mean pulmonary artery pressure must not be below left atrial pressure.",
        "negative_gradient",
      );
    return {
      pvrWoodUnits:
        (meanPapMmhg - leftAtrialMmhg) / (input.cardiacOutputLPerMin as number),
    };
  },
});
export const runPulmonaryVascularResistance =
  pulmonaryVascularResistanceTool.execute;
export default pulmonaryVascularResistanceTool;
