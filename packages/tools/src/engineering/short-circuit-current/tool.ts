import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShortCircuitCurrentInput = Readonly<{
  readonly voltageVolts: number;
  readonly impedanceOhms: number;
}>;
export type ShortCircuitCurrentOutput = Readonly<{
  readonly currentAmperes: number;
}>;

export const calculateShortCircuitCurrent = (
  x: ShortCircuitCurrentInput,
): ShortCircuitCurrentOutput => {
  if (!Number.isFinite(x.voltageVolts) || x.voltageVolts < 0)
    simpleError("voltageVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.impedanceOhms) || x.impedanceOhms < 0)
    simpleError("impedanceOhms", "Provide a finite number at least 0.");
  const currentAmperes = x.voltageVolts / x.impedanceOhms;
  if (!Number.isFinite(currentAmperes))
    simpleError(
      "currentAmperes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { currentAmperes: Object.is(currentAmperes, -0) ? 0 : currentAmperes };
};

export const example = {
  input: { voltageVolts: 230, impedanceOhms: 0.5 },
  output: { currentAmperes: 460 },
} satisfies ToolExample<ShortCircuitCurrentInput, ShortCircuitCurrentOutput>;

export const tool = createSimpleTool({
  id: "engineering/short-circuit-current",
  title: "Short Circuit Current",
  description:
    "Ideal prospective short-circuit RMS current from source RMS voltage and total fault-loop impedance magnitude.",
  inputs: [
    {
      id: "voltageVolts",
      kind: "number",
      label: "Voltage Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "impedanceOhms",
      kind: "number",
      label: "Impedance Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current Amperes",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateShortCircuitCurrent({
      voltageVolts: input.voltageVolts as number,
      impedanceOhms: input.impedanceOhms as number,
    }),
});
export const shortCircuitCurrentTool = tool;
export const runShortCircuitCurrent = tool.execute;
export default tool;
