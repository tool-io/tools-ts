import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoomForceInput = {
  readonly attachmentHeightMeters: number;
  readonly boomLengthMeters: number;
  readonly sheetTensionNewtons: number;
};

export type BoomForceOutput = {
  readonly boomForceNewtons: number;
};

export const boomForceExample = {
  input: {
    attachmentHeightMeters: 1.5,
    boomLengthMeters: 4,
    sheetTensionNewtons: 300,
  },
  output: { boomForceNewtons: 800 },
} satisfies ToolExample<BoomForceInput, BoomForceOutput>;

export const calculateBoomForce = (input: BoomForceInput): BoomForceOutput => {
  if (input.sheetTensionNewtons <= 0)
    simpleError(
      "sheetTensionNewtons",
      "The sheet tension must be positive.",
      "invalid_tension",
    );
  if (input.boomLengthMeters <= 0)
    simpleError(
      "boomLengthMeters",
      "The boom length must be positive.",
      "invalid_length",
    );
  if (input.attachmentHeightMeters <= 0)
    simpleError(
      "attachmentHeightMeters",
      "The attachment height must be positive.",
      "invalid_height",
    );
  return {
    boomForceNewtons:
      (input.sheetTensionNewtons * input.boomLengthMeters) /
      input.attachmentHeightMeters,
  };
};

export const boomForceTool = createSimpleTool({
  calculate: (input) => calculateBoomForce(input as unknown as BoomForceInput),
  description:
    "Compute the compression force on the boom from sheet tension via torque balance about the gooseneck.",
  id: "sailing/boom-force",
  inputs: [
    {
      description: "Tension in the mainsheet.",
      id: "sheetTensionNewtons",
      kind: "number",
      label: "Sheet tension",
      unit: "N",
    },
    {
      description: "Distance from the gooseneck to the sheet attachment.",
      id: "boomLengthMeters",
      kind: "number",
      label: "Boom length",
      unit: "m",
    },
    {
      description: "Height of the sheet attachment above the gooseneck.",
      id: "attachmentHeightMeters",
      kind: "number",
      label: "Attachment height",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Force acting on the boom at the attachment point.",
      format: "force",
      id: "boomForceNewtons",
      kind: "number",
      label: "Boom force",
      unit: "N",
    },
  ],
  title: "Boom Force Calculator",
});
export const runBoomForce = boomForceTool.execute;
export default boomForceTool;
