import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClinoformLengthInput = {
  readonly clinoformHeightM: number;
  readonly foresetDipDeg: number;
};

export type ClinoformLengthOutput = {
  readonly clinoformLengthM: number;
};

export const calculateClinoformLength = (
  input: ClinoformLengthInput,
): ClinoformLengthOutput => {
  const { clinoformHeightM, foresetDipDeg } = input;
  if (!(clinoformHeightM >= 0))
    simpleError(
      "clinoformHeightM",
      "Clinoform height must be non-negative.",
      "invalid_height",
    );
  if (!(foresetDipDeg > 0 && foresetDipDeg <= 90))
    simpleError(
      "foresetDipDeg",
      "Foreset dip must be greater than 0 and at most 90 degrees.",
      "invalid_dip",
    );
  return {
    clinoformLengthM:
      clinoformHeightM / Math.sin((foresetDipDeg * Math.PI) / 180),
  };
};

export const clinoformLengthExample = {
  input: { clinoformHeightM: 400, foresetDipDeg: 3 },
  output: { clinoformLengthM: 7642.92904371896 },
} satisfies ToolExample<ClinoformLengthInput, ClinoformLengthOutput>;

export const clinoformLengthTool = createSimpleTool({
  id: "geology/clinoform-length",
  title: "Clinoform Length Calculator",
  description:
    "Along-slope length of a clinoform surface from its vertical relief and foreset dip: L = h / sin(dip).",
  inputs: [
    {
      description:
        "Vertical clinoform height (shelf-edge to basin-floor relief) in metres.",
      id: "clinoformHeightM",
      kind: "number",
      label: "Clinoform height",
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
      description: "Along-slope length of the clinoform surface in metres.",
      id: "clinoformLengthM",
      kind: "number",
      label: "Slope length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateClinoformLength(input as unknown as ClinoformLengthInput),
});

export const runClinoformLength = clinoformLengthTool.execute;
export default clinoformLengthTool;
