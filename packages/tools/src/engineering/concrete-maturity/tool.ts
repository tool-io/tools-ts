import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteMaturityInput = Readonly<{
  readonly concreteCelsius: number;
  readonly datumCelsius: number;
  readonly elapsedHours: number;
}>;
export type ConcreteMaturityOutput = Readonly<{
  readonly maturityCelsiusHours: number;
}>;

export const calculateConcreteMaturity = (
  x: ConcreteMaturityInput,
): ConcreteMaturityOutput => {
  if (!Number.isFinite(x.concreteCelsius))
    simpleError("concreteCelsius", "Provide a finite number.");
  if (!Number.isFinite(x.datumCelsius))
    simpleError("datumCelsius", "Provide a finite number.");
  if (!Number.isFinite(x.elapsedHours) || x.elapsedHours < 0)
    simpleError("elapsedHours", "Provide a finite number at least 0.");
  if (x.concreteCelsius < x.datumCelsius)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const maturityCelsiusHours =
    (x.concreteCelsius - x.datumCelsius) * x.elapsedHours;
  if (!Number.isFinite(maturityCelsiusHours))
    simpleError(
      "maturityCelsiusHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    maturityCelsiusHours: Object.is(maturityCelsiusHours, -0)
      ? 0
      : maturityCelsiusHours,
  };
};

export const example = {
  input: { concreteCelsius: 20, datumCelsius: -10, elapsedHours: 24 },
  output: { maturityCelsiusHours: 720 },
} satisfies ToolExample<ConcreteMaturityInput, ConcreteMaturityOutput>;

export const tool = createSimpleTool({
  id: "engineering/concrete-maturity",
  title: "Concrete Maturity",
  description:
    "Nurse–Saul concrete maturity over one constant-temperature interval: (T−Tdatum)·time; requires a mix-calibrated datum.",
  inputs: [
    {
      id: "concreteCelsius",
      kind: "number",
      label: "Concrete Celsius",
      unit: "°C",
    },
    { id: "datumCelsius", kind: "number", label: "Datum Celsius", unit: "°C" },
    {
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maturityCelsiusHours",
      kind: "number",
      label: "Maturity Celsius Hours",
      unit: "°C·h",
    },
  ],
  calculate: (input) =>
    calculateConcreteMaturity({
      concreteCelsius: input.concreteCelsius as number,
      datumCelsius: input.datumCelsius as number,
      elapsedHours: input.elapsedHours as number,
    }),
});
export const concreteMaturityTool = tool;
export const runConcreteMaturity = tool.execute;
export default tool;
