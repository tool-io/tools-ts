import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StartLineFavoredEndInput = {
  readonly lineLengthNm: number;
  readonly boatSpeedKt: number;
  readonly lineBearingDeg: number;
  readonly trueWindFromDeg: number;
};

export type StartLineFavoredEndOutput = {
  readonly favoredEnd: string;
  readonly biasSeconds: number;
};

export const startLineFavoredEndExample = {
  input: {
    lineLengthNm: 1,
    boatSpeedKt: 6,
    lineBearingDeg: 90,
    trueWindFromDeg: 90,
  },
  output: { favoredEnd: "pin", biasSeconds: 600 },
} satisfies ToolExample<StartLineFavoredEndInput, StartLineFavoredEndOutput>;

export const calculateStartLineFavoredEnd = (
  input: StartLineFavoredEndInput,
): StartLineFavoredEndOutput => {
  if (!(input.lineLengthNm > 0))
    simpleError(
      "lineLengthNm",
      "Line length must be positive.",
      "invalid_length",
    );
  if (!(input.boatSpeedKt > 0))
    simpleError("boatSpeedKt", "Boat speed must be positive.", "invalid_speed");
  const biasSeconds =
    ((input.lineLengthNm * 3600) / input.boatSpeedKt) *
    Math.cos((input.lineBearingDeg - input.trueWindFromDeg) * (Math.PI / 180));
  return {
    biasSeconds,
    favoredEnd:
      Math.abs(biasSeconds) < 1
        ? "even"
        : biasSeconds > 0
          ? "pin"
          : "committee-boat",
  };
};

export const startLineFavoredEndTool = createSimpleTool({
  id: "sailing/start-line-favored-end",
  title: "Favored End Calculator",
  description:
    "Identify which end of the start line is favored by comparing the time to sail the line against the true wind direction.",
  inputs: [
    {
      description: "Length of the starting line.",
      id: "lineLengthNm",
      kind: "number",
      label: "Line length",
      unit: "nm",
    },
    {
      description: "Boat speed used to sail the line.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      unit: "kt",
    },
    {
      description: "Compass bearing of the line from committee boat to pin.",
      id: "lineBearingDeg",
      kind: "number",
      label: "Line bearing",
      unit: "\u00B0",
    },
    {
      description: "Direction the true wind blows from.",
      id: "trueWindFromDeg",
      kind: "number",
      label: "True wind from",
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "End of the line that is favored.",
      id: "favoredEnd",
      kind: "string",
      label: "Favored end",
    },
    {
      description: "Signed time advantage in seconds for sailing the line.",
      format: "duration-s",
      id: "biasSeconds",
      kind: "number",
      label: "Bias",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateStartLineFavoredEnd(input as unknown as StartLineFavoredEndInput),
});

export const runStartLineFavoredEnd = startLineFavoredEndTool.execute;
export default startLineFavoredEndTool;
