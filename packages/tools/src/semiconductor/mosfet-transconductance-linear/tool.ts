import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mosfetTransconductanceLinearExample = {
  input: { knAPerV2: 200, vdsV: 0.1 },
  output: { transconductanceS: 20 },
} satisfies ToolExample<
  MosfetTransconductanceLinearInput,
  MosfetTransconductanceLinearOutput
>;

export type MosfetTransconductanceLinearInput = {
  readonly knAPerV2: number;
  readonly vdsV: number;
};
export type MosfetTransconductanceLinearOutput = {
  readonly transconductanceS: number;
};

export const calculateMosfetTransconductanceLinear = (
  input: MosfetTransconductanceLinearInput,
): MosfetTransconductanceLinearOutput => {
  if (input.knAPerV2 <= 0 || input.vdsV <= 0)
    simpleError("knAPerV2", "Kn and VDS must be positive.", "invalid_input");
  return { transconductanceS: input.knAPerV2 * input.vdsV };
};

export const mosfetTransconductanceLinearTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetTransconductanceLinear({
      knAPerV2: input.knAPerV2 as number,
      vdsV: input.vdsV as number,
    }),
  description: "Compute MOSFET transconductance in the linear (triode) region.",
  id: "semiconductor/mosfet-transconductance-linear",
  inputs: [
    {
      id: "knAPerV2",
      kind: "number",
      label: "Kn",
      unit: "A/V²",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "vdsV",
      kind: "number",
      label: "VDS",
      unit: "V",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "transconductanceS", kind: "number", label: "gm", unit: "S" },
  ],
  title: "MOSFET Transconductance Linear Region Calculator",
});
export const runMosfetTransconductanceLinear =
  mosfetTransconductanceLinearTool.execute;
export default mosfetTransconductanceLinearTool;
