import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShortCircuitMvaInput = Readonly<{
  readonly lineVoltageKilovolts: number;
  readonly faultCurrentKiloamperes: number;
}>;
export type ShortCircuitMvaOutput = Readonly<{
  readonly faultMegaVoltAmperes: number;
}>;

export const calculateShortCircuitMva = (
  x: ShortCircuitMvaInput,
): ShortCircuitMvaOutput => {
  if (!Number.isFinite(x.lineVoltageKilovolts) || x.lineVoltageKilovolts < 0)
    simpleError("lineVoltageKilovolts", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.faultCurrentKiloamperes) ||
    x.faultCurrentKiloamperes < 0
  )
    simpleError(
      "faultCurrentKiloamperes",
      "Provide a finite number at least 0.",
    );
  const faultMegaVoltAmperes =
    Math.sqrt(3) * x.lineVoltageKilovolts * x.faultCurrentKiloamperes;
  if (!Number.isFinite(faultMegaVoltAmperes))
    simpleError(
      "faultMegaVoltAmperes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    faultMegaVoltAmperes: Object.is(faultMegaVoltAmperes, -0)
      ? 0
      : faultMegaVoltAmperes,
  };
};

export const example = {
  input: { lineVoltageKilovolts: 11, faultCurrentKiloamperes: 10 },
  output: { faultMegaVoltAmperes: 190.5255888325765 },
} satisfies ToolExample<ShortCircuitMvaInput, ShortCircuitMvaOutput>;

export const tool = createSimpleTool({
  id: "engineering/short-circuit-mva",
  title: "Short Circuit MVA",
  description:
    "Balanced three-phase fault apparent power in MVA from line-to-line voltage in kV and fault current in kA.",
  inputs: [
    {
      id: "lineVoltageKilovolts",
      kind: "number",
      label: "Line Voltage Kilovolts",
      unit: "kV",
      minimum: 0,
    },
    {
      id: "faultCurrentKiloamperes",
      kind: "number",
      label: "Fault Current Kiloamperes",
      unit: "kA",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "faultMegaVoltAmperes",
      kind: "number",
      label: "Fault Mega Volt Amperes",
      unit: "MVA",
    },
  ],
  calculate: (input) =>
    calculateShortCircuitMva({
      lineVoltageKilovolts: input.lineVoltageKilovolts as number,
      faultCurrentKiloamperes: input.faultCurrentKiloamperes as number,
    }),
});
export const shortCircuitMvaTool = tool;
export const runShortCircuitMva = tool.execute;
export default tool;
