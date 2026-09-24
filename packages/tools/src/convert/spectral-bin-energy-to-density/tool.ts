import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  binEnergy: number;
  lowerWavelength: number;
  upperWavelength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "binEnergy", label: "Bin energy", kind: "number" },
  { id: "lowerWavelength", label: "Lower wavelength", kind: "number" },
  { id: "upperWavelength", label: "Upper wavelength", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.binEnergy >= 0 &&
      i.lowerWavelength >= 0 &&
      i.upperWavelength > i.lowerWavelength,
  );
  return H.finish({
    meanSpectralDensity: i.binEnergy / (i.upperWavelength - i.lowerWavelength),
    binWidth: i.upperWavelength - i.lowerWavelength,
  });
};
export const example = {
  input: { binEnergy: 6, lowerWavelength: 2, upperWavelength: 5 },
  output: { result: { meanSpectralDensity: 2, binWidth: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "convert/spectral-bin-energy-to-density",
  title: "Conversion: Spectral Bin Energy To Density Tool",
  description:
    "Convert integrated energy in one explicitly bounded wavelength bin into mean density per matching wavelength unit; no spectrum reconstruction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          binWidth: { type: "number" },
          meanSpectralDensity: { type: "number" },
        },
        required: ["binWidth", "meanSpectralDensity"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
