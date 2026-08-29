import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EmiInductorReactanceInput = Readonly<{
  readonly frequencyHz: number;
  readonly inductanceHenries: number;
}>;
export type EmiInductorReactanceOutput = Readonly<{ reactanceOhms: number }>;

export const calculateEmiInductorReactance = (
  i: EmiInductorReactanceInput,
): EmiInductorReactanceOutput => {
  const direct = 2 * Math.PI * i.frequencyHz * i.inductanceHenries;
  const scaled = 2 * Math.PI * (i.frequencyHz * i.inductanceHenries);
  const value =
    Number.isFinite(direct) && direct !== 0
      ? direct
      : Number.isFinite(scaled) && scaled !== 0
        ? scaled
        : i.frequencyHz === 0 || i.inductanceHenries === 0
          ? 0
          : Math.exp(
              Math.log(2 * Math.PI) +
                Math.log(i.frequencyHz) +
                Math.log(i.inductanceHenries),
            );
  if (!Number.isFinite(value))
    simpleError("reactanceOhms", "The inputs produce a non-finite result.");
  return { reactanceOhms: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { frequencyHz: 1000, inductanceHenries: 0.01 },
  output: { reactanceOhms: 62.83185307179586 },
} satisfies ToolExample<EmiInductorReactanceInput, EmiInductorReactanceOutput>;

export const tool = createSimpleTool({
  id: "electronics/emi-inductor-reactance",
  title: "EMI Inductor Reactance",
  description:
    "Calculate ideal inductor reactance 2πfL from frequency and inductance, ignoring winding resistance and self-resonance.",
  inputs: [
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency (Hz)",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "inductanceHenries",
      kind: "number",
      label: "Inductance (H)",
      unit: "H",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "reactanceOhms", kind: "number", label: "Reactance (Ω)", unit: "Ω" },
  ],
  calculate: (input) =>
    calculateEmiInductorReactance({
      frequencyHz: input.frequencyHz as number,
      inductanceHenries: input.inductanceHenries as number,
    }),
});
export const emiInductorReactanceTool = tool;
export const runEmiInductorReactance = tool.execute;
export default tool;
