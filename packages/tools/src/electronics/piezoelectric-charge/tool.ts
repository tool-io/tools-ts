import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { chargeCoefficientCPerN: 2e-10, forceN: 100 },
  output: { chargeC: 2e-8 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/piezoelectric-charge",
  title: "Piezoelectric Charge",
  description:
    "Calculate generated charge Q=dF from an effective piezoelectric charge coefficient and force along a matched axis. Enter d in C/N and force in N; orientation and mechanical boundary conditions must match the coefficient.",
  inputs: [
    {
      id: "chargeCoefficientCPerN",
      kind: "number",
      label: "Piezoelectric coefficient (C/N)",
    },
    { id: "forceN", kind: "number", label: "Applied force (N)" },
  ],
  outputs: [{ id: "chargeC", kind: "number", label: "Charge C" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { chargeC: i.chargeCoefficientCPerN * i.forceN };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PiezoelectricChargeInput = Readonly<typeof example.input>;
export type PiezoelectricChargeOutput = Readonly<typeof example.output>;
export const piezoelectricChargeTool = tool;
export const runPiezoelectricCharge = tool.execute;
export default tool;
