import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisplayBrightnessNitsInput = Readonly<{
  readonly lumens: number;
  readonly areaSquareMeters: number;
}>;
export type DisplayBrightnessNitsOutput = Readonly<{
  readonly brightnessNits: number;
}>;

export const calculateDisplayBrightnessNits = (
  x: DisplayBrightnessNitsInput,
): DisplayBrightnessNitsOutput => {
  if (!Number.isFinite(x.lumens) || x.lumens < 0)
    simpleError("lumens", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  const brightnessNits = x.lumens / (Math.PI * x.areaSquareMeters);
  if (!Number.isFinite(brightnessNits))
    simpleError(
      "brightnessNits",
      "Inputs produce an undefined or non-finite result.",
    );
  return { brightnessNits: Object.is(brightnessNits, -0) ? 0 : brightnessNits };
};

export const example = {
  input: { lumens: 314.1592653589793, areaSquareMeters: 1 },
  output: { brightnessNits: 100 },
} satisfies ToolExample<
  DisplayBrightnessNitsInput,
  DisplayBrightnessNitsOutput
>;

export const tool = createSimpleTool({
  id: "electronics/display-brightness-nits",
  title: "Display Brightness Nits",
  description:
    "Average luminance of an ideal Lambertian emitter from luminous flux and emitting surface area.",
  inputs: [
    { id: "lumens", kind: "number", label: "Lumens", unit: "lm", minimum: 0 },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "brightnessNits",
      kind: "number",
      label: "Brightness Nits",
      unit: "cd/m²",
    },
  ],
  calculate: (input) =>
    calculateDisplayBrightnessNits({
      lumens: input.lumens as number,
      areaSquareMeters: input.areaSquareMeters as number,
    }),
});
export const displayBrightnessNitsTool = tool;
export const runDisplayBrightnessNits = tool.execute;
export default tool;
