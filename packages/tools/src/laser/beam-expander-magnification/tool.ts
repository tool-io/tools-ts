import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstFocalLengthMillimeters: number;
  readonly secondFocalLengthMillimeters: number;
  readonly inputBeamDiameterMillimeters: number;
}>;
export type Output = Readonly<{
  readonly signedMagnification: number;
  readonly outputBeamDiameterMillimeters: number;
  readonly configuration: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.firstFocalLengthMillimeters === 0)
    simpleError(
      "firstFocalLengthMillimeters",
      "First focal length must not be zero.",
      "division_by_zero",
    );
  const signedMagnification =
    input.secondFocalLengthMillimeters / input.firstFocalLengthMillimeters;
  return {
    signedMagnification,
    outputBeamDiameterMillimeters:
      Math.abs(signedMagnification) * input.inputBeamDiameterMillimeters,
    configuration:
      input.firstFocalLengthMillimeters * input.secondFocalLengthMillimeters < 0
        ? "galilean"
        : "keplerian",
  };
};

export const exampleInput = {
  firstFocalLengthMillimeters: -25,
  secondFocalLengthMillimeters: 100,
  inputBeamDiameterMillimeters: 2,
} satisfies Input;
export const exampleOutput = {
  signedMagnification: -4,
  outputBeamDiameterMillimeters: 8,
  configuration: "galilean",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstFocalLengthMillimeters: input.firstFocalLengthMillimeters as number,
      secondFocalLengthMillimeters:
        input.secondFocalLengthMillimeters as number,
      inputBeamDiameterMillimeters:
        input.inputBeamDiameterMillimeters as number,
    }),
  description:
    "Calculate signed beam-expander magnification, output diameter, and lens configuration.",
  id: "laser/beam-expander-magnification",
  inputs: [
    {
      id: "firstFocalLengthMillimeters",
      label: "First-lens focal length",
      kind: "number",
      unit: "mm",
    },
    {
      id: "secondFocalLengthMillimeters",
      label: "Second-lens focal length",
      kind: "number",
      unit: "mm",
    },
    {
      id: "inputBeamDiameterMillimeters",
      label: "Input beam diameter",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "signedMagnification",
      label: "Signed angular magnification",
      kind: "number",
    },
    {
      id: "outputBeamDiameterMillimeters",
      label: "Output beam diameter",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "configuration",
      label: "Lens configuration",
      kind: "string",
      enum: ["galilean", "keplerian"],
    },
  ],
  title: "Beam-Expander Magnification",
});

export const run = tool.execute;
export default tool;
