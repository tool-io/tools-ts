import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MiredToKelvinInput = Readonly<{
  readonly mired: number;
}>;
export type MiredToKelvinOutput = Readonly<{
  readonly temperatureKelvin: number;
}>;

export const calculateMiredToKelvin = (
  x: MiredToKelvinInput,
): MiredToKelvinOutput => {
  if (!Number.isFinite(x.mired) || x.mired < 0)
    simpleError("mired", "Provide a finite number at least 0.");
  const temperatureKelvin = 1000000 / x.mired;
  if (!Number.isFinite(temperatureKelvin))
    simpleError(
      "temperatureKelvin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    temperatureKelvin: Object.is(temperatureKelvin, -0) ? 0 : temperatureKelvin,
  };
};

export const example = {
  input: { mired: 200 },
  output: { temperatureKelvin: 5000 },
} satisfies ToolExample<MiredToKelvinInput, MiredToKelvinOutput>;

export const tool = createSimpleTool({
  id: "film/mired-to-kelvin",
  title: "Mired To Kelvin",
  description:
    "Convert reciprocal megakelvin (mired) to absolute color temperature: 10⁶/mired.",
  inputs: [
    { id: "mired", kind: "number", label: "Mired", unit: "mired", minimum: 0 },
  ],
  outputs: [
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature Kelvin",
      unit: "K",
    },
  ],
  calculate: (input) =>
    calculateMiredToKelvin({
      mired: input.mired as number,
    }),
});
export const miredToKelvinTool = tool;
export const runMiredToKelvin = tool.execute;
export default tool;
