import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CopticModuleRatioClassifierInput = {
  readonly nibWidthMm: number;
  readonly letterHeightMm: number;
  readonly fineModuleMaximum: number;
  readonly broadModuleMinimum: number;
};

export type CopticModuleRatioClassifierOutput = {
  readonly moduleRatio: number;
  readonly moduleClass: "fine_module" | "medium_module" | "broad_module";
};

export const calculateCopticModuleRatioClassifier = (
  input: CopticModuleRatioClassifierInput,
): CopticModuleRatioClassifierOutput => {
  for (const key of [
    "nibWidthMm",
    "letterHeightMm",
    "fineModuleMaximum",
    "broadModuleMinimum",
  ] as const) {
    if (!(Number.isFinite(input[key]) && input[key] > 0))
      return simpleError(
        key,
        "Measurements and thresholds must be greater than zero.",
        "invalid_measurement",
      );
  }
  if (input.broadModuleMinimum <= input.fineModuleMaximum)
    return simpleError(
      "broadModuleMinimum",
      "The broad-module threshold must exceed the fine-module threshold.",
      "invalid_thresholds",
    );
  const moduleRatio = input.letterHeightMm / input.nibWidthMm;
  if (!(Number.isFinite(moduleRatio) && moduleRatio > 0))
    return simpleError(
      "nibWidthMm",
      "The module ratio is outside the finite numeric range.",
      "numeric_range",
    );
  const moduleClass =
    moduleRatio <= input.fineModuleMaximum
      ? "fine_module"
      : moduleRatio >= input.broadModuleMinimum
        ? "broad_module"
        : "medium_module";
  return { moduleRatio, moduleClass };
};

export const copticModuleRatioClassifierExample = {
  input: {
    nibWidthMm: 0.5,
    letterHeightMm: 2.25,
    fineModuleMaximum: 5,
    broadModuleMinimum: 7,
  },
  output: { moduleRatio: 4.5, moduleClass: "fine_module" },
} satisfies ToolExample<
  CopticModuleRatioClassifierInput,
  CopticModuleRatioClassifierOutput
>;

export const copticModuleRatioClassifierTool = createSimpleTool({
  id: "paleography/coptic-module-ratio-classifier",
  title: "Coptic Module Ratio Classifier",
  description:
    "Divide measured letter height by measured pen-nib width for a Coptic hand and classify the module as fine, medium or broad using YOUR supplied thresholds (required inputs, since no single scholarly convention is universal).",
  inputs: [
    {
      description: "Measured pen nib width in millimetres.",
      id: "nibWidthMm",
      kind: "number",
      label: "Nib width",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Measured letter height in millimetres.",
      id: "letterHeightMm",
      kind: "number",
      label: "Letter height",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Your fine-module upper bound on the ratio.",
      id: "fineModuleMaximum",
      kind: "number",
      label: "Fine max",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Your broad-module lower bound on the ratio.",
      id: "broadModuleMinimum",
      kind: "number",
      label: "Broad min",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Letter height divided by nib width.",
      id: "moduleRatio",
      kind: "number",
      label: "Module ratio",
    },
    {
      description: "Module class under your supplied thresholds.",
      id: "moduleClass",
      enum: ["fine_module", "medium_module", "broad_module"],
      kind: "string",
      label: "Module class",
    },
  ],
  calculate: (input) =>
    calculateCopticModuleRatioClassifier({
      broadModuleMinimum: input.broadModuleMinimum as number,
      fineModuleMaximum: input.fineModuleMaximum as number,
      letterHeightMm: input.letterHeightMm as number,
      nibWidthMm: input.nibWidthMm as number,
    }),
});

export const runCopticModuleRatioClassifier =
  copticModuleRatioClassifierTool.execute;
export default copticModuleRatioClassifierTool;
