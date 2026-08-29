import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    referenceLifetimeHours: 2000,
    activationEnergyEv: 0.7,
    referenceTemperatureK: 378.15,
    useTemperatureK: 358.15,
  },
  output: { estimatedLifetimeHours: 6637.388151873066 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/capacitor-lifetime-arrhenius",
  title: "Capacitor Arrhenius Lifetime Estimate",
  description:
    "Scale a reference lifetime to another absolute temperature with an activation-energy Arrhenius factor, L=Lref exp[Ea/k(1/Tuse−1/Tref)]. Supply a component-specific Ea; voltage stress and other ageing mechanisms are excluded.",
  inputs: [
    {
      id: "referenceLifetimeHours",
      kind: "number",
      label: "Reference lifetime (h)",
      minimum: 0,
    },
    {
      id: "activationEnergyEv",
      kind: "number",
      label: "Activation energy (eV)",
      minimum: 0,
    },
    {
      id: "referenceTemperatureK",
      kind: "number",
      label: "Reference temperature (K)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "useTemperatureK",
      kind: "number",
      label: "Use temperature (K)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "estimatedLifetimeHours",
      kind: "number",
      label: "Estimated Lifetime Hours",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      estimatedLifetimeHours:
        i.referenceLifetimeHours *
        Math.exp(
          (i.activationEnergyEv / 8.617333262145e-5) *
            (1 / i.useTemperatureK - 1 / i.referenceTemperatureK),
        ),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CapacitorLifetimeArrheniusInput = Readonly<typeof example.input>;
export type CapacitorLifetimeArrheniusOutput = Readonly<typeof example.output>;
export const capacitorLifetimeArrheniusTool = tool;
export const runCapacitorLifetimeArrhenius = tool.execute;
export default tool;
