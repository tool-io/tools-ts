import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BellowsExtensionFactorInput = Readonly<{
  readonly lensToFilmMillimeters: number;
  readonly focalLengthMillimeters: number;
}>;
export type BellowsExtensionFactorOutput = Readonly<{
  readonly exposureFactor: number;
}>;

export const calculateBellowsExtensionFactor = (
  x: BellowsExtensionFactorInput,
): BellowsExtensionFactorOutput => {
  if (!Number.isFinite(x.lensToFilmMillimeters) || x.lensToFilmMillimeters < 0)
    simpleError("lensToFilmMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters < 0
  )
    simpleError(
      "focalLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.lensToFilmMillimeters < x.focalLengthMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const exposureFactor =
    (x.lensToFilmMillimeters / x.focalLengthMillimeters) ** 2;
  if (!Number.isFinite(exposureFactor))
    simpleError(
      "exposureFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { exposureFactor: Object.is(exposureFactor, -0) ? 0 : exposureFactor };
};

export const example = {
  input: { lensToFilmMillimeters: 100, focalLengthMillimeters: 50 },
  output: { exposureFactor: 4 },
} satisfies ToolExample<
  BellowsExtensionFactorInput,
  BellowsExtensionFactorOutput
>;

export const tool = createSimpleTool({
  id: "film/bellows-extension-factor",
  title: "Bellows Extension Factor",
  description:
    "Exposure factor caused by lens extension when the lens-to-film distance exceeds focal length: (extension/focal)².",
  inputs: [
    {
      id: "lensToFilmMillimeters",
      kind: "number",
      label: "Lens To Film Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "exposureFactor", kind: "number", label: "Exposure Factor" }],
  calculate: (input) =>
    calculateBellowsExtensionFactor({
      lensToFilmMillimeters: input.lensToFilmMillimeters as number,
      focalLengthMillimeters: input.focalLengthMillimeters as number,
    }),
});
export const bellowsExtensionFactorTool = tool;
export const runBellowsExtensionFactor = tool.execute;
export default tool;
