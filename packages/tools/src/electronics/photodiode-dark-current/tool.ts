import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhotodiodeDarkCurrentInput = Readonly<{
  readonly referenceAmperes: number;
  readonly temperatureCelsius: number;
  readonly referenceCelsius: number;
  readonly doublingDegreesCelsius: number;
}>;
export type PhotodiodeDarkCurrentOutput = Readonly<{
  readonly darkAmperes: number;
}>;

export const calculatePhotodiodeDarkCurrent = (
  x: PhotodiodeDarkCurrentInput,
): PhotodiodeDarkCurrentOutput => {
  if (!Number.isFinite(x.referenceAmperes) || x.referenceAmperes < 0)
    simpleError("referenceAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureCelsius) || x.temperatureCelsius < -273.15)
    simpleError(
      "temperatureCelsius",
      "Provide a finite number at least -273.15.",
    );
  if (!Number.isFinite(x.referenceCelsius) || x.referenceCelsius < -273.15)
    simpleError(
      "referenceCelsius",
      "Provide a finite number at least -273.15.",
    );
  if (
    !Number.isFinite(x.doublingDegreesCelsius) ||
    x.doublingDegreesCelsius < 0
  )
    simpleError(
      "doublingDegreesCelsius",
      "Provide a finite number at least 0.",
    );
  const darkAmperes =
    x.referenceAmperes *
    2 **
      ((x.temperatureCelsius - x.referenceCelsius) / x.doublingDegreesCelsius);
  if (!Number.isFinite(darkAmperes))
    simpleError(
      "darkAmperes",
      "Inputs produce an undefined or non-finite result.",
    );
  return { darkAmperes: Object.is(darkAmperes, -0) ? 0 : darkAmperes };
};

export const example = {
  input: {
    referenceAmperes: 1e-9,
    temperatureCelsius: 30,
    referenceCelsius: 20,
    doublingDegreesCelsius: 10,
  },
  output: { darkAmperes: 2e-9 },
} satisfies ToolExample<
  PhotodiodeDarkCurrentInput,
  PhotodiodeDarkCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/photodiode-dark-current",
  title: "Photodiode Dark Current",
  description:
    "Empirical dark-current estimate from a measured reference current and an assumed doubling interval in temperature.",
  inputs: [
    {
      id: "referenceAmperes",
      kind: "number",
      label: "Reference Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "temperatureCelsius",
      kind: "number",
      label: "Temperature Celsius",
      unit: "°C",
      minimum: -273.15,
    },
    {
      id: "referenceCelsius",
      kind: "number",
      label: "Reference Celsius",
      unit: "°C",
      minimum: -273.15,
    },
    {
      id: "doublingDegreesCelsius",
      kind: "number",
      label: "Doubling Degrees Celsius",
      unit: "°C",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "darkAmperes", kind: "number", label: "Dark Amperes", unit: "A" },
  ],
  calculate: (input) =>
    calculatePhotodiodeDarkCurrent({
      referenceAmperes: input.referenceAmperes as number,
      temperatureCelsius: input.temperatureCelsius as number,
      referenceCelsius: input.referenceCelsius as number,
      doublingDegreesCelsius: input.doublingDegreesCelsius as number,
    }),
});
export const photodiodeDarkCurrentTool = tool;
export const runPhotodiodeDarkCurrent = tool.execute;
export default tool;
