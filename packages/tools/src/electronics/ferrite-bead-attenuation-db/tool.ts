import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    beadResistanceOhm: 100,
    beadReactanceOhm: 0,
    loadResistanceOhm: 100,
  },
  output: { insertionLossDb: 6.020599913279624 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/ferrite-bead-attenuation-db",
  title: "Ferrite Bead Insertion Loss",
  description:
    "Estimate small-signal insertion loss for a ferrite bead in series with a resistive load from the bead's resistive and reactive impedance at the selected frequency. The source is assumed ideal; use datasheet impedance at frequency and account for DC-bias effects separately.",
  inputs: [
    {
      id: "beadResistanceOhm",
      kind: "number",
      label: "Bead resistance at frequency (Ω)",
      minimum: 0,
    },
    {
      id: "beadReactanceOhm",
      kind: "number",
      label: "Bead reactance at frequency (Ω)",
    },
    {
      id: "loadResistanceOhm",
      kind: "number",
      label: "Load resistance (Ω)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "insertionLossDb", kind: "number", label: "Insertion Loss dB" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      insertionLossDb:
        20 *
        Math.log10(
          Math.hypot(
            i.loadResistanceOhm + i.beadResistanceOhm,
            i.beadReactanceOhm,
          ) / i.loadResistanceOhm,
        ),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type FerriteBeadAttenuationDbInput = Readonly<typeof example.input>;
export type FerriteBeadAttenuationDbOutput = Readonly<typeof example.output>;
export const ferriteBeadAttenuationDbTool = tool;
export const runFerriteBeadAttenuationDb = tool.execute;
export default tool;
