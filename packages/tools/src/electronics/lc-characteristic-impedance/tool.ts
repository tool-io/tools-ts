import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LcCharacteristicImpedanceInput = {
  readonly capacitanceF: number;
  readonly inductanceH: number;
};

export type LcCharacteristicImpedanceOutput = {
  readonly characteristicImpedanceOhms: number;
};

export const lcCharacteristicImpedanceExample = {
  input: { capacitanceF: 1e-9, inductanceH: 0.001 },
  output: { characteristicImpedanceOhms: 1000 },
} satisfies ToolExample<
  LcCharacteristicImpedanceInput,
  LcCharacteristicImpedanceOutput
>;

export const calculateLcCharacteristicImpedance = (
  input: LcCharacteristicImpedanceInput,
): LcCharacteristicImpedanceOutput => {
  if (!(input.inductanceH > 0))
    simpleError(
      "inductanceH",
      "Inductance must be positive.",
      "invalid_inductance",
    );
  if (!(input.capacitanceF > 0))
    simpleError(
      "capacitanceF",
      "Capacitance must be positive.",
      "invalid_capacitance",
    );
  return {
    characteristicImpedanceOhms: Math.sqrt(
      input.inductanceH / input.capacitanceF,
    ),
  };
};

export const lcCharacteristicImpedanceTool = createSimpleTool({
  calculate: (input) =>
    calculateLcCharacteristicImpedance(
      input as unknown as LcCharacteristicImpedanceInput,
    ),
  description: "Calculate the characteristic impedance of an LC network.",
  id: "electronics/lc-characteristic-impedance",
  inputs: [
    { id: "inductanceH", kind: "number", label: "Inductance", unit: "H" },
    { id: "capacitanceF", kind: "number", label: "Capacitance", unit: "F" },
  ],
  outputs: [
    {
      id: "characteristicImpedanceOhms",
      kind: "number",
      label: "Characteristic impedance",
      unit: "ohm",
    },
  ],
  title: "LC Characteristic Impedance",
});
export const runLcCharacteristicImpedance =
  lcCharacteristicImpedanceTool.execute;
export default lcCharacteristicImpedanceTool;
