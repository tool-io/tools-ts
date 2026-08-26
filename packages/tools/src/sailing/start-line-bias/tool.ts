import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StartLineBiasInput = {
  readonly boatSpeedKt: number;
  readonly lineBearingDeg: number;
  readonly lineLengthNm: number;
  readonly trueWindFromDeg: number;
};

export type StartLineBiasOutput = {
  readonly lineBiasSeconds: number;
};

export const startLineBiasExample = {
  input: {
    boatSpeedKt: 6,
    lineBearingDeg: 90,
    lineLengthNm: 0.5,
    trueWindFromDeg: 90,
  },
  output: { lineBiasSeconds: 300 },
} satisfies ToolExample<StartLineBiasInput, StartLineBiasOutput>;

export const calculateStartLineBias = (
  input: StartLineBiasInput,
): StartLineBiasOutput => {
  if (input.lineLengthNm <= 0)
    simpleError(
      "lineLengthNm",
      "Line length must be positive.",
      "invalid_input",
    );
  if (input.boatSpeedKt <= 0)
    simpleError("boatSpeedKt", "Boat speed must be positive.", "invalid_input");
  return {
    lineBiasSeconds:
      ((input.lineLengthNm * 3600) / input.boatSpeedKt) *
      Math.cos(
        ((input.lineBearingDeg - input.trueWindFromDeg) * Math.PI) / 180,
      ),
  };
};

export const startLineBiasTool = createSimpleTool({
  calculate: (input) =>
    calculateStartLineBias(input as unknown as StartLineBiasInput),
  description:
    "Compute signed start line bias from biasSeconds = (lineLengthNm * 3600 / boatSpeedKt) * cos((lineBearingDeg - trueWindFromDeg) * PI / 180); positive favors the pin end.",
  id: "sailing/start-line-bias",
  inputs: [
    {
      description: "Length of the starting line.",
      id: "lineLengthNm",
      kind: "number",
      label: "Line length",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Boat speed for the beat upwind.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      minimum: 0,
      unit: "kn",
    },
    {
      description:
        "Compass bearing of the starting line from committee boat to pin.",
      id: "lineBearingDeg",
      kind: "number",
      label: "Line bearing",
      maximum: 360,
      minimum: 0,
      unit: "deg",
    },
    {
      description: "Direction the true wind blows from.",
      id: "trueWindFromDeg",
      kind: "number",
      label: "True wind from",
      maximum: 360,
      minimum: 0,
      unit: "deg",
    },
  ],
  outputs: [
    {
      description:
        "Signed time advantage in seconds; positive means biased to the pin end.",
      format: "duration-s",
      id: "lineBiasSeconds",
      kind: "number",
      label: "Line bias",
      unit: "s",
    },
  ],
  title: "Start Line Bias Calculator",
});
export const runStartLineBias = startLineBiasTool.execute;
export default startLineBiasTool;
