import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const kappaSiteAnelasticAttenuationExample = {
  input: { kappaSeconds: 0.04, frequencyHz: 5 },
  output: { attenuationFactor: 0.5334880910911033 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const kappaSiteAnelasticAttenuationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ kappaSeconds, frequencyHz }) => ({
      attenuationFactor: Math.exp(-Math.PI * kappaSeconds * frequencyHz),
    }))(input as never) as Record<string, unknown>,
  description:
    "Site anelastic attenuation factor exp(−π κ f) at a given frequency.",
  id: "seismology/kappa-site-anelastic-attenuation",
  inputs: [
    {
      minimum: 0,
      description: "Site kappa.",
      id: "kappaSeconds",
      kind: "number",
      label: "κ",
      unit: "s",
    },
    {
      minimum: 0,
      description: "Frequency.",
      id: "frequencyHz",
      kind: "number",
      label: "f",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      description: "Spectral attenuation factor.",
      id: "attenuationFactor",
      kind: "number",
      label: "exp(−πκf)",
    },
  ],
  title: "Kappa Site Anelastic Attenuation Calculator",
});
export const runKappaSiteAnelasticAttenuation =
  kappaSiteAnelasticAttenuationTool.execute;
export { kappaSiteAnelasticAttenuationExample as example };
export default kappaSiteAnelasticAttenuationTool;
