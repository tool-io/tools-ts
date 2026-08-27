import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const emitterResistorExample = {
  input: { emitterCurrentMa: 2, emitterVolts: 1 },
} satisfies ToolExample<{
  readonly emitterCurrentMa: number;
  readonly emitterVolts: number;
}>;

export const emitterResistorTool = createSimpleTool({
  id: "electronics/emitter-resistor",
  title: "Emitter Resistor Value",
  description:
    "Compute the emitter resistor value in ohms from the emitter voltage and emitter current.",
  inputs: [
    { id: "emitterVolts", label: "Emitter voltage", kind: "number" },
    { id: "emitterCurrentMa", label: "Emitter current", kind: "number" },
  ],
  outputs: [
    { id: "emitterResistorOhms", label: "Emitter resistor", kind: "number" },
  ],
  calculate: (input) => {
    const emitterVolts = input.emitterVolts as number;
    const emitterCurrentMa = input.emitterCurrentMa as number;
    if (emitterVolts <= 0)
      simpleError("emitterVolts", "Emitter voltage must be greater than zero.");
    if (emitterCurrentMa <= 0)
      simpleError(
        "emitterCurrentMa",
        "Emitter current must be greater than zero.",
      );
    return { emitterResistorOhms: (emitterVolts / emitterCurrentMa) * 1000 };
  },
});
export const runEmitterResistor = emitterResistorTool.execute;
export default emitterResistorTool;
