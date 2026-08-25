import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CorkFitCheckerInput = {
  readonly boreDiameterMm: number;
  readonly corkDiameterMm: number;
  readonly maximumCompressionPercent: number;
  readonly minimumCompressionPercent: number;
};

export type CorkFitCheckerOutput = {
  readonly compressionPercent: number;
  readonly fitsBore: boolean;
};

export const corkFitCheckerExample = {
  input: {
    boreDiameterMm: 18.5,
    corkDiameterMm: 22,
    maximumCompressionPercent: 45,
    minimumCompressionPercent: 15,
  },
  output: {
    compressionPercent: 15.9090909091,
    fitsBore: true,
  },
} satisfies ToolExample<CorkFitCheckerInput, CorkFitCheckerOutput>;

export const calculateCorkFit = (
  input: CorkFitCheckerInput,
): CorkFitCheckerOutput => {
  const bore = input.boreDiameterMm;
  if (bore <= 0)
    simpleError(
      "boreDiameterMm",
      "The bore diameter must be positive.",
      "invalid_value",
    );
  if (input.corkDiameterMm <= 0)
    simpleError(
      "corkDiameterMm",
      "The cork diameter must be positive.",
      "invalid_value",
    );
  if (input.maximumCompressionPercent < input.minimumCompressionPercent)
    simpleError(
      "maximumCompressionPercent",
      "Maximum compression cannot be below minimum compression.",
      "invalid_value",
    );
  const compression =
    ((input.corkDiameterMm - bore) / input.corkDiameterMm) * 100;
  return {
    compressionPercent: roundStatistic(compression),
    fitsBore:
      compression >= input.minimumCompressionPercent &&
      compression <= input.maximumCompressionPercent,
  };
};

export const corkFitCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateCorkFit(input as unknown as CorkFitCheckerInput),
  description:
    "Calculate diametral cork compression in a bottle bore and compare it with caller-supplied minimum and maximum limits from the closure and bottle specifications.",
  id: "oenology/cork-fit-checker",
  inputs: [
    {
      description: "Inside diameter of the finished neck bore.",
      id: "boreDiameterMm",
      kind: "number",
      label: "Bore diameter",
      minimum: 0.000001,
      unit: "mm",
    },
    {
      description: "Diameter of the cork to be inserted.",
      id: "corkDiameterMm",
      kind: "number",
      label: "Cork diameter",
      minimum: 0.000001,
      unit: "mm",
    },
    {
      description: "Largest acceptable diametral compression.",
      id: "maximumCompressionPercent",
      kind: "number",
      label: "Maximum compression",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Smallest acceptable diametral compression.",
      id: "minimumCompressionPercent",
      kind: "number",
      label: "Minimum compression",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Radial compression the cork undergoes on insertion.",
      id: "compressionPercent",
      kind: "number",
      label: "Compression",
      unit: "%",
    },
    {
      description: "Whether compression sits inside the supplied limits.",
      id: "fitsBore",
      kind: "boolean",
      label: "Fits bore",
    },
  ],
  title: "Cork Diameter Fit Checker",
});
export const runCorkFitChecker = corkFitCheckerTool.execute;
export default corkFitCheckerTool;
