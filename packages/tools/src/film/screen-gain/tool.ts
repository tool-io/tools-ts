import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScreenGainInput = Readonly<{
  readonly screenNits: number;
  readonly referenceNits: number;
}>;
export type ScreenGainOutput = Readonly<{
  readonly screenGain: number;
}>;

export const calculateScreenGain = (x: ScreenGainInput): ScreenGainOutput => {
  if (!Number.isFinite(x.screenNits) || x.screenNits < 0)
    simpleError("screenNits", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.referenceNits) || x.referenceNits < 0)
    simpleError("referenceNits", "Provide a finite number at least 0.");
  const screenGain = x.screenNits / x.referenceNits;
  if (!Number.isFinite(screenGain))
    simpleError(
      "screenGain",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { screenGain: Object.is(screenGain, -0) ? 0 : screenGain };
};

export const example = {
  input: { screenNits: 200, referenceNits: 100 },
  output: { screenGain: 2 },
} satisfies ToolExample<ScreenGainInput, ScreenGainOutput>;

export const tool = createSimpleTool({
  id: "film/screen-gain",
  title: "Screen Gain",
  description:
    "Relative screen gain as measured screen luminance divided by reference matte-white luminance under the same illumination.",
  inputs: [
    {
      id: "screenNits",
      kind: "number",
      label: "Screen Nits",
      unit: "cd/m²",
      minimum: 0,
    },
    {
      id: "referenceNits",
      kind: "number",
      label: "Reference Nits",
      unit: "cd/m²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "screenGain", kind: "number", label: "Screen Gain" }],
  calculate: (input) =>
    calculateScreenGain({
      screenNits: input.screenNits as number,
      referenceNits: input.referenceNits as number,
    }),
});
export const screenGainTool = tool;
export const runScreenGain = tool.execute;
export default tool;
