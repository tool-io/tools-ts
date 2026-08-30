import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly operatingTemperatureKelvin: number;
  readonly maximumTemperatureKelvin: number;
}>;
export type Output = Readonly<{
  readonly coolingMarginKelvin: number;
  readonly withinTemperatureLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const coolingMarginKelvin =
    input.maximumTemperatureKelvin - input.operatingTemperatureKelvin;
  return {
    coolingMarginKelvin,
    withinTemperatureLimit: coolingMarginKelvin >= 0,
  };
};

export const exampleInput = {
  operatingTemperatureKelvin: 70,
  maximumTemperatureKelvin: 80,
} satisfies Input;
export const exampleOutput = {
  coolingMarginKelvin: 10,
  withinTemperatureLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      operatingTemperatureKelvin: input.operatingTemperatureKelvin as number,
      maximumTemperatureKelvin: input.maximumTemperatureKelvin as number,
    }),
  description:
    "Compare a THz laser operating temperature with a supplied cooling limit.",
  id: "laser/thz-cooling-margin",
  inputs: [
    {
      id: "operatingTemperatureKelvin",
      label: "Operating temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "maximumTemperatureKelvin",
      label: "Maximum supported temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "coolingMarginKelvin",
      label: "Cooling margin",
      kind: "number",
      unit: "K",
    },
    {
      id: "withinTemperatureLimit",
      label: "Within temperature limit",
      kind: "boolean",
    },
  ],
  title: "THz Cooling Margin",
});

export const run = tool.execute;
export default tool;
