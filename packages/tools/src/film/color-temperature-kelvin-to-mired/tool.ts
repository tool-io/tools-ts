import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColorTemperatureKelvinToMiredInput = Readonly<{
  readonly temperatureKelvin: number;
}>;
export type ColorTemperatureKelvinToMiredOutput = Readonly<{
  readonly mired: number;
}>;

export const calculateColorTemperatureKelvinToMired = (
  x: ColorTemperatureKelvinToMiredInput,
): ColorTemperatureKelvinToMiredOutput => {
  if (!Number.isFinite(x.temperatureKelvin) || x.temperatureKelvin < 0)
    simpleError("temperatureKelvin", "Provide a finite number at least 0.");
  const mired = 1000000 / x.temperatureKelvin;
  if (!Number.isFinite(mired))
    simpleError("mired", "Inputs produce an undefined or out-of-range result.");
  return { mired: Object.is(mired, -0) ? 0 : mired };
};

export const example = {
  input: { temperatureKelvin: 5000 },
  output: { mired: 200 },
} satisfies ToolExample<
  ColorTemperatureKelvinToMiredInput,
  ColorTemperatureKelvinToMiredOutput
>;

export const tool = createSimpleTool({
  id: "film/color-temperature-kelvin-to-mired",
  title: "Color Temperature Kelvin To Mired",
  description:
    "Convert absolute color temperature in kelvin to reciprocal megakelvin (mired): 10⁶/K.",
  inputs: [
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature Kelvin",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [{ id: "mired", kind: "number", label: "Mired", unit: "mired" }],
  calculate: (input) =>
    calculateColorTemperatureKelvinToMired({
      temperatureKelvin: input.temperatureKelvin as number,
    }),
});
export const colorTemperatureKelvinToMiredTool = tool;
export const runColorTemperatureKelvinToMired = tool.execute;
export default tool;
