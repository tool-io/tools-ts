import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VermeilThicknessInput = {
  readonly jurisdictionRequiredMinimumMicrometers: number;
  readonly measuredGoldLayerMicrometers: number;
};

export type VermeilThicknessOutput = {
  readonly additionalThicknessMicrometers: number;
  readonly jurisdictionCaution: string;
  readonly meetsCallerRequirement: boolean;
};

export const screenVermeilLayerThickness = (
  input: VermeilThicknessInput,
): VermeilThicknessOutput => {
  if (
    !Number.isFinite(input.measuredGoldLayerMicrometers) ||
    input.measuredGoldLayerMicrometers <= 0
  )
    simpleError(
      "measuredGoldLayerMicrometers",
      "Measured gold-layer thickness must be finite and positive.",
      "gold_thickness_invalid",
    );
  if (
    !Number.isFinite(input.jurisdictionRequiredMinimumMicrometers) ||
    input.jurisdictionRequiredMinimumMicrometers < 0
  )
    simpleError(
      "jurisdictionRequiredMinimumMicrometers",
      "Required minimum must be finite and nonnegative.",
      "minimum_thickness_invalid",
    );
  return {
    additionalThicknessMicrometers: Math.max(
      0,
      input.measuredGoldLayerMicrometers -
        input.jurisdictionRequiredMinimumMicrometers,
    ),
    jurisdictionCaution:
      "Vermeil, plated, and precious-metal marks are jurisdiction-, date-, component-, and material-specific. Verify the applicable law and the Swiss responsibility mark rather than applying one global micron threshold.",
    meetsCallerRequirement:
      input.measuredGoldLayerMicrometers >=
      input.jurisdictionRequiredMinimumMicrometers,
  };
};

export const vermeilThicknessExample = {
  input: {
    jurisdictionRequiredMinimumMicrometers: 5,
    measuredGoldLayerMicrometers: 2.5,
  },
  output: {
    additionalThicknessMicrometers: 0,
    jurisdictionCaution:
      "Vermeil, plated, and precious-metal marks are jurisdiction-, date-, component-, and material-specific. Verify the applicable law and the Swiss responsibility mark rather than applying one global micron threshold.",
    meetsCallerRequirement: false,
  },
} satisfies ToolExample<VermeilThicknessInput, VermeilThicknessOutput>;

export const vermeilThicknessTool = createSimpleTool({
  calculate: (input) =>
    screenVermeilLayerThickness({
      jurisdictionRequiredMinimumMicrometers:
        input.jurisdictionRequiredMinimumMicrometers as number,
      measuredGoldLayerMicrometers:
        input.measuredGoldLayerMicrometers as number,
    }),
  description:
    "Screen a measured gold layer against an explicit jurisdiction-specific minimum without treating vermeil or hallmark thickness as globally uniform.",
  id: "horology/vermeil-layer-thickness-screen",
  inputs: [
    {
      id: "jurisdictionRequiredMinimumMicrometers",
      kind: "number",
      label: "Jurisdiction-required minimum gold layer",
      minimum: 0,
      unit: "um",
    },
    {
      id: "measuredGoldLayerMicrometers",
      kind: "number",
      label: "Measured gold-layer thickness",
      minimum: 0,
      unit: "um",
    },
  ],
  outputs: [
    {
      id: "additionalThicknessMicrometers",
      kind: "number",
      label: "Thickness above caller minimum",
      minimum: 0,
      unit: "um",
    },
    {
      id: "jurisdictionCaution",
      kind: "string",
      label: "Jurisdiction and hallmark caution",
    },
    {
      id: "meetsCallerRequirement",
      kind: "boolean",
      label: "Meets caller thickness requirement",
    },
  ],
  title: "Vermeil Layer Thickness Screen",
});

export const runVermeilThickness = vermeilThicknessTool.execute;
export default vermeilThicknessTool;
