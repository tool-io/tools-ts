import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mosfetTransconductanceSaturationExample = {
  input: { knAPerV2: 200, overdriveV: 1 },
  output: { transconductanceS: 200 },
} satisfies ToolExample<
  MosfetTransconductanceSaturationInput,
  MosfetTransconductanceSaturationOutput
>;

export type MosfetTransconductanceSaturationInput = {
  readonly knAPerV2: number;
  readonly overdriveV: number;
};
export type MosfetTransconductanceSaturationOutput = {
  readonly transconductanceS: number;
};

export const calculateMosfetTransconductanceSaturation = (
  input: MosfetTransconductanceSaturationInput,
): MosfetTransconductanceSaturationOutput => {
  if (input.knAPerV2 <= 0 || input.overdriveV <= 0)
    simpleError(
      "overdriveV",
      "Kn and overdrive must be positive.",
      "invalid_input",
    );
  return { transconductanceS: input.knAPerV2 * input.overdriveV };
};

export const mosfetTransconductanceSaturationTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetTransconductanceSaturation({
      knAPerV2: input.knAPerV2 as number,
      overdriveV: input.overdriveV as number,
    }),
  description:
    "Compute MOSFET transconductance in saturation from Kn and overdrive voltage.",
  id: "semiconductor/mosfet-transconductance-saturation",
  inputs: [
    {
      id: "knAPerV2",
      kind: "number",
      label: "Kn",
      unit: "A/V²",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "VGS minus VT.",
      id: "overdriveV",
      kind: "number",
      label: "Overdrive",
      unit: "V",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "transconductanceS", kind: "number", label: "gm", unit: "S" },
  ],
  title: "MOSFET Transconductance Saturation Calculator",
});
export const runMosfetTransconductanceSaturation =
  mosfetTransconductanceSaturationTool.execute;
export default mosfetTransconductanceSaturationTool;
