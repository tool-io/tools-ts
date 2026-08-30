import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WdmChannelSpacingInput = Readonly<{
  readonly firstWavelengthNm: number;
  readonly secondWavelengthNm: number;
}>;
export type WdmChannelSpacingOutput = Readonly<{
  readonly frequencySpacingHz: number;
}>;

export const calculateWdmChannelSpacing = (
  x: WdmChannelSpacingInput,
): WdmChannelSpacingOutput => {
  if (!Number.isFinite(x.firstWavelengthNm) || x.firstWavelengthNm < 0)
    simpleError("firstWavelengthNm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondWavelengthNm) || x.secondWavelengthNm < 0)
    simpleError("secondWavelengthNm", "Provide a finite number at least 0.");
  if (!(x.firstWavelengthNm > 0 && x.secondWavelengthNm > 0))
    simpleError("input", "Wavelengths must be positive.");
  const frequencySpacingHz =
    299792458e9 * Math.abs(1 / x.firstWavelengthNm - 1 / x.secondWavelengthNm);
  if (!Number.isFinite(frequencySpacingHz))
    simpleError("frequencySpacingHz", "The inputs produce an invalid result.");
  return {
    frequencySpacingHz: Object.is(frequencySpacingHz, -0)
      ? 0
      : frequencySpacingHz,
  };
};

export const example = {
  input: { firstWavelengthNm: 1550, secondWavelengthNm: 1551 },
  output: { frequencySpacingHz: 124703087706.16113 },
} satisfies ToolExample<WdmChannelSpacingInput, WdmChannelSpacingOutput>;

export const tool = createSimpleTool({
  id: "electronics/wdm-channel-spacing",
  title: "WDM Channel Spacing",
  description:
    "Find absolute optical frequency separation of two wavelength-division multiplexing channels from their vacuum wavelengths.",
  inputs: [
    {
      id: "firstWavelengthNm",
      kind: "number",
      label: "First vacuum wavelength",
      unit: "nm",
      minimum: 0,
    },
    {
      id: "secondWavelengthNm",
      kind: "number",
      label: "Second vacuum wavelength",
      unit: "nm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "frequencySpacingHz",
      kind: "number",
      label: "Optical frequency spacing",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateWdmChannelSpacing({
      firstWavelengthNm: input.firstWavelengthNm as number,
      secondWavelengthNm: input.secondWavelengthNm as number,
    }),
});
export const wdmChannelSpacingTool = tool;
export const runWdmChannelSpacing = tool.execute;
export default tool;
