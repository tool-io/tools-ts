import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClinoformHeightInput = {
  readonly clinoformLengthM: number;
  readonly foresetDipDeg: number;
};

export type ClinoformHeightOutput = {
  readonly clinoformHeightM: number;
};

export const calculateClinoformHeight = (
  input: ClinoformHeightInput,
): ClinoformHeightOutput => {
  const { clinoformLengthM, foresetDipDeg } = input;
  if (!(clinoformLengthM >= 0))
    simpleError(
      "clinoformLengthM",
      "Clinoform slope length must be non-negative.",
      "invalid_length",
    );
  if (!(foresetDipDeg > 0 && foresetDipDeg <= 90))
    simpleError(
      "foresetDipDeg",
      "Foreset dip must be greater than 0 and at most 90 degrees.",
      "invalid_dip",
    );
  return {
    clinoformHeightM:
      clinoformLengthM * Math.sin((foresetDipDeg * Math.PI) / 180),
  };
};

export const clinoformHeightExample = {
  input: { clinoformLengthM: 1500, foresetDipDeg: 4 },
  output: { clinoformHeightM: 104.63471061618796 },
} satisfies ToolExample<ClinoformHeightInput, ClinoformHeightOutput>;

export const clinoformHeightTool = createSimpleTool({
  id: "geology/clinoform-height",
  title: "Clinoform Height Calculator",
  description:
    "Vertical relief of a clinoform from its along-slope length and foreset dip: h = L * sin(dip).",
  inputs: [
    {
      description: "Along-slope length of the clinoform surface in metres.",
      id: "clinoformLengthM",
      kind: "number",
      label: "Slope length",
      unit: "m",
    },
    {
      description: "Foreset dip in degrees.",
      id: "foresetDipDeg",
      kind: "number",
      label: "Foreset dip",
    },
  ],
  outputs: [
    {
      description:
        "Vertical clinoform height (shelf-edge to basin-floor relief) in metres.",
      id: "clinoformHeightM",
      kind: "number",
      label: "Clinoform height",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateClinoformHeight(input as unknown as ClinoformHeightInput),
});

export const runClinoformHeight = clinoformHeightTool.execute;
export default clinoformHeightTool;
