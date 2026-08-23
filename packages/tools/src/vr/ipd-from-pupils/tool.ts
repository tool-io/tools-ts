import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const calculateIpdFromPupils = (
  input: IpdFromPupilsInput,
): IpdFromPupilsOutput => ({
  ipdMm: Math.abs(input.rightPupilMm - input.leftPupilMm),
});

export const ipdFromPupilsTool = createSimpleTool({
  id: "vr/ipd-from-pupils",
  title: "IPD From Pupils Calculator",
  description:
    "Derive interpupillary distance from the measured left and right pupil center positions.",
  inputs: [
    {
      description: "Left pupil center position along the measurement axis.",
      id: "leftPupilMm",
      label: "Left pupil",
      kind: "number",
      unit: "mm",
    },
    {
      description: "Right pupil center position along the measurement axis.",
      id: "rightPupilMm",
      label: "Right pupil",
      kind: "number",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Absolute distance between pupil centers.",
      id: "ipdMm",
      label: "IPD",
      kind: "number",
      unit: "mm",
    },
  ],
  calculate: (input) => calculateIpdFromPupils(input as IpdFromPupilsInput),
});
export const runIpdFromPupils = ipdFromPupilsTool.execute;
export default ipdFromPupilsTool;

export type IpdFromPupilsInput = {
  readonly leftPupilMm: number;
  readonly rightPupilMm: number;
};

export type IpdFromPupilsOutput = {
  readonly ipdMm: number;
};

export const ipdFromPupilsExample = {
  input: { leftPupilMm: 30, rightPupilMm: 94 },
  output: { ipdMm: 64 },
} satisfies ToolExample<IpdFromPupilsInput, IpdFromPupilsOutput>;
