import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AbsorbanceFromTransmittanceInput = {
  readonly transmittancePercent: number;
};

export type AbsorbanceFromTransmittanceOutput = {
  readonly absorbance: number;
};

export const absorbanceFromTransmittanceExample = {
  input: { transmittancePercent: 25 },
  output: { absorbance: 0.6020599913279624 },
} satisfies ToolExample<
  AbsorbanceFromTransmittanceInput,
  AbsorbanceFromTransmittanceOutput
>;

export const absorbanceFromTransmittanceTool = createSimpleTool({
  id: "chemistry/absorbance-from-transmittance",
  title: "Absorbance From Transmittance",
  description: "Convert percent transmittance to absorbance.",
  inputs: [
    {
      id: "transmittancePercent",
      label: "Transmittance",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [{ id: "absorbance", label: "Absorbance", kind: "number" }],
  calculate: (input) => {
    const transmittancePercent = input.transmittancePercent as number;
    if (transmittancePercent <= 0 || transmittancePercent >= 100)
      simpleError(
        "transmittancePercent",
        "Transmittance must be between zero and one hundred percent exclusively.",
      );
    return { absorbance: -Math.log10(transmittancePercent / 100) };
  },
});
export const runAbsorbanceFromTransmittance =
  absorbanceFromTransmittanceTool.execute;
export default absorbanceFromTransmittanceTool;
