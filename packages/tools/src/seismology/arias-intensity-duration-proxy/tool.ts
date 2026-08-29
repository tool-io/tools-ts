import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const ariasIntensityDurationProxyExample = {
  input: { pgaMS2: 2, effectiveDurationS: 10 },
  output: { ariasIntensityMS: 6.404877988970016 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const ariasIntensityDurationProxyTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ pgaMS2, effectiveDurationS }) => ({
      ariasIntensityMS:
        (Math.PI / (2 * 9.81)) * pgaMS2 ** 2 * effectiveDurationS,
    }))(input as never) as Record<string, unknown>,
  description:
    "Arias intensity proxy I_a ≈ (π/2g)·∫a² dt approximated by PGA² times effective duration.",
  id: "seismology/arias-intensity-duration-proxy",
  inputs: [
    {
      minimum: 0,
      description: "Peak acceleration.",
      id: "pgaMS2",
      kind: "number",
      label: "a_max",
      unit: "m/s²",
    },
    {
      minimum: 0,
      description: "Effective strong-motion duration.",
      id: "effectiveDurationS",
      kind: "number",
      label: "D_eff",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Arias intensity.",
      id: "ariasIntensityMS",
      kind: "number",
      label: "I_a",
      unit: "m/s",
    },
  ],
  title: "Arias Intensity Duration Proxy Calculator",
});
export const runAriasIntensityDurationProxy =
  ariasIntensityDurationProxyTool.execute;
export { ariasIntensityDurationProxyExample as example };
export default ariasIntensityDurationProxyTool;
