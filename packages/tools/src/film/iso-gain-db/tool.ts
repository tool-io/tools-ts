import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IsoGainDbInput = Readonly<{
  readonly baseIso: number;
  readonly targetIso: number;
}>;
export type IsoGainDbOutput = Readonly<{
  readonly gainDecibels: number;
}>;

export const calculateIsoGainDb = (x: IsoGainDbInput): IsoGainDbOutput => {
  if (!Number.isFinite(x.baseIso) || x.baseIso < 0)
    simpleError("baseIso", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.targetIso) || x.targetIso < 0)
    simpleError("targetIso", "Provide a finite number at least 0.");
  const gainDecibels = 20 * Math.log10(x.targetIso / x.baseIso);
  if (!Number.isFinite(gainDecibels))
    simpleError(
      "gainDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { gainDecibels: Object.is(gainDecibels, -0) ? 0 : gainDecibels };
};

export const example = {
  input: { baseIso: 100, targetIso: 200 },
  output: { gainDecibels: 6.020599913279624 },
} satisfies ToolExample<IsoGainDbInput, IsoGainDbOutput>;

export const tool = createSimpleTool({
  id: "film/iso-gain-db",
  title: "ISO Gain dB",
  description:
    "Analog-equivalent ISO gain change in decibels as 20 log₁₀(target ISO/base ISO); a doubling corresponds to about 6.02 dB.",
  inputs: [
    { id: "baseIso", kind: "number", label: "Base Iso", minimum: 0 },
    { id: "targetIso", kind: "number", label: "Target Iso", minimum: 0 },
  ],
  outputs: [
    { id: "gainDecibels", kind: "number", label: "Gain Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateIsoGainDb({
      baseIso: input.baseIso as number,
      targetIso: input.targetIso as number,
    }),
});
export const isoGainDbTool = tool;
export const runIsoGainDb = tool.execute;
export default tool;
