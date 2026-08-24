import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HollingsheadAbiStatusIndexInput = {
  readonly educationScale: number;
  readonly occupationScale: number;
};

export type HollingsheadAbiStatusIndexOutput = {
  readonly statusIndex: number;
};

export const hollingsheadAbiStatusIndexExample = {
  input: {
    educationScale: 5,
    occupationScale: 6,
  },
  output: {
    statusIndex: 62,
  },
} satisfies ToolExample<
  HollingsheadAbiStatusIndexInput,
  HollingsheadAbiStatusIndexOutput
>;

const SCALE_MAX = 7;

export const calculateHollingsheadAbi = (
  input: HollingsheadAbiStatusIndexInput,
): HollingsheadAbiStatusIndexOutput => {
  if (
    !Number.isSafeInteger(input.educationScale) ||
    input.educationScale < 1 ||
    input.educationScale > SCALE_MAX ||
    !Number.isSafeInteger(input.occupationScale) ||
    input.occupationScale < 1 ||
    input.occupationScale > SCALE_MAX
  )
    simpleError(
      "educationScale",
      "Both seven-point scales must run from one to seven.",
      "invalid_value",
    );
  return {
    statusIndex: input.occupationScale * 7 + input.educationScale * 4,
  };
};

export const hollingsheadAbiStatusIndexTool = createSimpleTool({
  calculate: (input) =>
    calculateHollingsheadAbi({
      educationScale: input.educationScale as number,
      occupationScale: input.occupationScale as number,
    }),
  description:
    "Compute the Hollingshead Two Factor Index of social position as occupation times seven plus education times four.",
  id: "sociology/hollingshead-abi-status-index",
  inputs: [
    {
      description: "Education rating on the seven point scale.",
      id: "educationScale",
      kind: "integer",
      label: "Education scale",
      maximum: 7,
      minimum: 1,
    },
    {
      description: "Occupation rating on the seven point scale.",
      id: "occupationScale",
      kind: "integer",
      label: "Occupation scale",
      maximum: 7,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Two factor index between eleven and seventy-seven.",
      id: "statusIndex",
      kind: "integer",
      label: "Status index",
    },
  ],
  title: "Hollingshead ABI Status Index Calculator",
});
export const runHollingsheadAbiStatusIndex =
  hollingsheadAbiStatusIndexTool.execute;
export default hollingsheadAbiStatusIndexTool;
