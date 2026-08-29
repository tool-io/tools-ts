import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const aftershockZoneLengthUtsuScalingExample = {
  input: { mainshockMagnitudeMw: 6 },
  output: {
    zoneLengthKm: 15.848931924611133,
    equivalentAreaKm2: 197.2830989970594,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const aftershockZoneLengthUtsuScalingTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ mainshockMagnitudeMw }) => {
      const zoneLengthKm = Math.pow(10, 0.5 * mainshockMagnitudeMw - 1.8);
      return {
        zoneLengthKm,
        equivalentAreaKm2: Math.PI * (zoneLengthKm / 2) ** 2,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Utsu aftershock-zone scaling: log₁₀L(km) = 0.5·M − 1.8, with equivalent area.",
  id: "seismology/aftershock-zone-length-utsu-scaling",
  inputs: [
    {
      description: "Mainshock magnitude.",
      id: "mainshockMagnitudeMw",
      kind: "number",
      label: "M",
    },
  ],
  outputs: [
    {
      description: "Aftershock zone length.",
      id: "zoneLengthKm",
      kind: "number",
      label: "L_as",
      unit: "km",
    },
    {
      description: "Circular-equivalent area.",
      id: "equivalentAreaKm2",
      kind: "number",
      label: "A",
      unit: "km²",
    },
  ],
  title: "Aftershock Zone Length Utsu Scaling Calculator",
});
export const runAftershockZoneLengthUtsuScaling =
  aftershockZoneLengthUtsuScalingTool.execute;
export { aftershockZoneLengthUtsuScalingExample as example };
export default aftershockZoneLengthUtsuScalingTool;
