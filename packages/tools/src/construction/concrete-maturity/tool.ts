import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteMaturityInput = Readonly<{
  readonly averageTemperatureCelsius: number;
  readonly datumTemperatureCelsius: number;
  readonly elapsedHours: number;
}>;
export type ConcreteMaturityOutput = Readonly<{ maturityCelsiusHours: number }>;

export const calculateConcreteMaturity = (
  i: ConcreteMaturityInput,
): ConcreteMaturityOutput => {
  const value =
    Math.max(0, i.averageTemperatureCelsius - i.datumTemperatureCelsius) *
    i.elapsedHours;
  if (!Number.isFinite(value))
    simpleError(
      "maturityCelsiusHours",
      "The inputs produce a non-finite result.",
    );
  return { maturityCelsiusHours: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    averageTemperatureCelsius: 20,
    datumTemperatureCelsius: -10,
    elapsedHours: 24,
  },
  output: { maturityCelsiusHours: 720 },
} satisfies ToolExample<ConcreteMaturityInput, ConcreteMaturityOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-maturity",
  title: "Concrete Maturity",
  description:
    "Calculate one-interval Nurse–Saul concrete maturity in Celsius-hours as max(Taverage−Tdatum,0) times elapsed hours; sum intervals for a complete curing history.",
  inputs: [
    {
      id: "averageTemperatureCelsius",
      kind: "number",
      label: "Average Temperature (°C)",
      unit: "°C",
    },
    {
      id: "datumTemperatureCelsius",
      kind: "number",
      label: "Datum Temperature (°C)",
      unit: "°C",
    },
    { id: "elapsedHours", kind: "number", label: "Elapsed Hours", minimum: 0 },
  ],
  outputs: [
    {
      id: "maturityCelsiusHours",
      kind: "number",
      label: "Maturity (°C·h)",
      unit: "°C·h",
    },
  ],
  calculate: (input) =>
    calculateConcreteMaturity({
      averageTemperatureCelsius: input.averageTemperatureCelsius as number,
      datumTemperatureCelsius: input.datumTemperatureCelsius as number,
      elapsedHours: input.elapsedHours as number,
    }),
});
export const concreteMaturityTool = tool;
export const runConcreteMaturity = tool.execute;
export default tool;
