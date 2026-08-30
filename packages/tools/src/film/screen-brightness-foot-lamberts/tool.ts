import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScreenBrightnessFootLambertsInput = Readonly<{
  readonly projectorLumens: number;
  readonly screenGain: number;
  readonly screenAreaSquareFeet: number;
}>;
export type ScreenBrightnessFootLambertsOutput = Readonly<{
  readonly brightnessFootLamberts: number;
}>;

export const calculateScreenBrightnessFootLamberts = (
  x: ScreenBrightnessFootLambertsInput,
): ScreenBrightnessFootLambertsOutput => {
  if (!Number.isFinite(x.projectorLumens) || x.projectorLumens < 0)
    simpleError("projectorLumens", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.screenGain) || x.screenGain < 0)
    simpleError("screenGain", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.screenAreaSquareFeet) || x.screenAreaSquareFeet < 0)
    simpleError("screenAreaSquareFeet", "Provide a finite number at least 0.");
  const brightnessFootLamberts =
    (x.projectorLumens * x.screenGain) / x.screenAreaSquareFeet;
  if (!Number.isFinite(brightnessFootLamberts))
    simpleError(
      "brightnessFootLamberts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    brightnessFootLamberts: Object.is(brightnessFootLamberts, -0)
      ? 0
      : brightnessFootLamberts,
  };
};

export const example = {
  input: { projectorLumens: 1000, screenGain: 1, screenAreaSquareFeet: 100 },
  output: { brightnessFootLamberts: 10 },
} satisfies ToolExample<
  ScreenBrightnessFootLambertsInput,
  ScreenBrightnessFootLambertsOutput
>;

export const tool = createSimpleTool({
  id: "film/screen-brightness-foot-lamberts",
  title: "Screen Brightness Foot Lamberts",
  description:
    "Approximate projected screen brightness in foot-lamberts from incident projector lumens, screen gain and screen area in square feet.",
  inputs: [
    {
      id: "projectorLumens",
      kind: "number",
      label: "Projector Lumens",
      unit: "lm",
      minimum: 0,
    },
    { id: "screenGain", kind: "number", label: "Screen Gain", minimum: 0 },
    {
      id: "screenAreaSquareFeet",
      kind: "number",
      label: "Screen Area Square Feet",
      unit: "ft²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "brightnessFootLamberts",
      kind: "number",
      label: "Brightness Foot Lamberts",
      unit: "fL",
    },
  ],
  calculate: (input) =>
    calculateScreenBrightnessFootLamberts({
      projectorLumens: input.projectorLumens as number,
      screenGain: input.screenGain as number,
      screenAreaSquareFeet: input.screenAreaSquareFeet as number,
    }),
});
export const screenBrightnessFootLambertsTool = tool;
export const runScreenBrightnessFootLamberts = tool.execute;
export default tool;
