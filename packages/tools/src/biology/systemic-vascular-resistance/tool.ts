import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SystemicVascularResistanceInput = {
  readonly meanArterialMmhg: number;
  readonly centralVenousMmhg: number;
  readonly cardiacOutputLPerMin: number;
};

export type SystemicVascularResistanceOutput = {
  readonly svrDynesSCm5: number;
};

export const systemicVascularResistanceExample = {
  input: {
    meanArterialMmhg: 90,
    centralVenousMmhg: 5,
    cardiacOutputLPerMin: 5,
  },
  output: { svrDynesSCm5: 1360 },
} satisfies ToolExample<
  SystemicVascularResistanceInput,
  SystemicVascularResistanceOutput
>;

export const systemicVascularResistanceTool = createSimpleTool({
  id: "biology/systemic-vascular-resistance",
  title: "SVR Calculator",
  description:
    "Compute systemic vascular resistance from MAP, CVP, and cardiac output.",
  inputs: [
    {
      id: "meanArterialMmhg",
      kind: "number",
      label: "Mean arterial pressure",
      unit: "mmHg",
    },
    {
      id: "centralVenousMmhg",
      kind: "number",
      label: "Central venous pressure",
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
      id: "svrDynesSCm5",
      kind: "number",
      label: "Systemic vascular resistance",
      unit: "dyn·s/cm⁵",
    },
  ],
  calculate: (input) => {
    const meanArterialMmhg = input.meanArterialMmhg as number;
    const centralVenousMmhg = input.centralVenousMmhg as number;
    if (meanArterialMmhg < centralVenousMmhg)
      simpleError(
        "meanArterialMmhg",
        "Mean arterial pressure must not be below central venous pressure.",
        "negative_gradient",
      );
    return {
      svrDynesSCm5:
        (80 * (meanArterialMmhg - centralVenousMmhg)) /
        (input.cardiacOutputLPerMin as number),
    };
  },
});
export const runSystemicVascularResistance =
  systemicVascularResistanceTool.execute;
export default systemicVascularResistanceTool;
