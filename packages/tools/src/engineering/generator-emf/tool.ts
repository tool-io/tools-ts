import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GeneratorEmfInput = Readonly<{
  readonly coilTurns: number;
  readonly fluxChangeWebers: number;
  readonly elapsedSeconds: number;
}>;
export type GeneratorEmfOutput = Readonly<{
  readonly emfVolts: number;
}>;

export const calculateGeneratorEmf = (
  x: GeneratorEmfInput,
): GeneratorEmfOutput => {
  if (!Number.isFinite(x.coilTurns) || x.coilTurns < 1)
    simpleError("coilTurns", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.fluxChangeWebers))
    simpleError("fluxChangeWebers", "Provide a finite number.");
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds < 0)
    simpleError("elapsedSeconds", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.coilTurns))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const emfVolts =
    (x.coilTurns * Math.abs(x.fluxChangeWebers)) / x.elapsedSeconds;
  if (!Number.isFinite(emfVolts))
    simpleError(
      "emfVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { emfVolts: Object.is(emfVolts, -0) ? 0 : emfVolts };
};

export const example = {
  input: { coilTurns: 100, fluxChangeWebers: 0.01, elapsedSeconds: 1 },
  output: { emfVolts: 1 },
} satisfies ToolExample<GeneratorEmfInput, GeneratorEmfOutput>;

export const tool = createSimpleTool({
  id: "engineering/generator-emf",
  title: "Generator Emf",
  description:
    "Average induced electromotive-force magnitude from coil turns times absolute magnetic-flux change divided by elapsed time.",
  inputs: [
    { id: "coilTurns", kind: "integer", label: "Coil Turns", minimum: 1 },
    {
      id: "fluxChangeWebers",
      kind: "number",
      label: "Flux Change Webers",
      unit: "Wb",
    },
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [{ id: "emfVolts", kind: "number", label: "Emf Volts", unit: "V" }],
  calculate: (input) =>
    calculateGeneratorEmf({
      coilTurns: input.coilTurns as number,
      fluxChangeWebers: input.fluxChangeWebers as number,
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const generatorEmfTool = tool;
export const runGeneratorEmf = tool.execute;
export default tool;
