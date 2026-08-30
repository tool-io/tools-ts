import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IlluminanceUniformityInput = Readonly<{
  readonly minimumLux: number;
  readonly averageLux: number;
}>;
export type IlluminanceUniformityOutput = Readonly<{
  readonly uniformityRatio: number;
}>;

export const calculateIlluminanceUniformity = (
  x: IlluminanceUniformityInput,
): IlluminanceUniformityOutput => {
  if (!Number.isFinite(x.minimumLux) || x.minimumLux < 0)
    simpleError("minimumLux", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.averageLux) || x.averageLux < 0)
    simpleError("averageLux", "Provide a finite number at least 0.");
  if (x.minimumLux > x.averageLux)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const uniformityRatio = x.minimumLux / x.averageLux;
  if (!Number.isFinite(uniformityRatio))
    simpleError(
      "uniformityRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    uniformityRatio: Object.is(uniformityRatio, -0) ? 0 : uniformityRatio,
  };
};

export const example = {
  input: { minimumLux: 300, averageLux: 500 },
  output: { uniformityRatio: 0.6 },
} satisfies ToolExample<
  IlluminanceUniformityInput,
  IlluminanceUniformityOutput
>;

export const tool = createSimpleTool({
  id: "engineering/illuminance-uniformity",
  title: "Illuminance Uniformity",
  description:
    "Lighting uniformity ratio of minimum measured illuminance to average illuminance on the same measurement grid.",
  inputs: [
    {
      id: "minimumLux",
      kind: "number",
      label: "Minimum Lux",
      unit: "lx",
      minimum: 0,
    },
    {
      id: "averageLux",
      kind: "number",
      label: "Average Lux",
      unit: "lx",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "uniformityRatio", kind: "number", label: "Uniformity Ratio" },
  ],
  calculate: (input) =>
    calculateIlluminanceUniformity({
      minimumLux: input.minimumLux as number,
      averageLux: input.averageLux as number,
    }),
});
export const illuminanceUniformityTool = tool;
export const runIlluminanceUniformity = tool.execute;
export default tool;
