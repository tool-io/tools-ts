import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    solidVaporNPerM: 0.06,
    solidLiquidNPerM: 0.04,
    liquidVaporNPerM: 0.04,
  },
  output: { contactAngleDeg: 60.00000000000001 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/contact-angle-young",
  title: "Young Contact Angle",
  description:
    "Calculate the equilibrium contact angle from solid–vapor, solid–liquid, and liquid–vapor interfacial energies using Young's equation. Valid only when the resulting cosine lies between −1 and 1; surface roughness and hysteresis are not modeled.",
  inputs: [
    {
      id: "solidVaporNPerM",
      kind: "number",
      label: "Solid–vapor energy (N/m)",
      minimum: 0,
    },
    {
      id: "solidLiquidNPerM",
      kind: "number",
      label: "Solid–liquid energy (N/m)",
      minimum: 0,
    },
    {
      id: "liquidVaporNPerM",
      kind: "number",
      label: "Liquid–vapor tension (N/m)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "contactAngleDeg", kind: "number", label: "Contact Angle Deg" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (
      Math.abs((i.solidVaporNPerM - i.solidLiquidNPerM) / i.liquidVaporNPerM) >
      1
    )
      simpleError(
        "solidVaporNPerM",
        "Interfacial energies imply a cosine outside the physical range.",
      );
    const output = {
      contactAngleDeg:
        (Math.acos(
          (i.solidVaporNPerM - i.solidLiquidNPerM) / i.liquidVaporNPerM,
        ) *
          180) /
        Math.PI,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ContactAngleYoungInput = Readonly<typeof example.input>;
export type ContactAngleYoungOutput = Readonly<typeof example.output>;
export const contactAngleYoungTool = tool;
export const runContactAngleYoung = tool.execute;
export default tool;
