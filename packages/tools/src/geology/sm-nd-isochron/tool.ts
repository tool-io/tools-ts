import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SmNdIsochronInput = {
  readonly smNd1: number;
  readonly ndRatio1: number;
  readonly smNd2: number;
  readonly ndRatio2: number;
};

export type SmNdIsochronOutput = {
  readonly slope: number;
  readonly initial143Nd144Nd: number;
  readonly ageYears: number;
  readonly ageMa: number;
};

const LAMBDA_SM147_PER_YEAR = 6.54e-12;

/**
 * Two-point Sm-Nd isochron: slope m of 143Nd/144Nd vs 147Sm/144Nd gives
 * t = ln(1 + m) / lambda(Sm-147) with intercept the initial 143Nd/144Nd.
 */
export const calculateSmNdIsochron = (
  input: SmNdIsochronInput,
): SmNdIsochronOutput => {
  if (input.smNd1 === input.smNd2)
    return simpleError(
      "smNd2",
      "The two points must have distinct 147Sm/144Nd values.",
      "degenerate_isochron",
    );
  const slope = (input.ndRatio2 - input.ndRatio1) / (input.smNd2 - input.smNd1);
  if (!(slope >= 0))
    return simpleError(
      "ndRatio2",
      "The isochron slope must be non-negative.",
      "invalid_slope",
    );
  const initial143Nd144Nd = input.ndRatio1 - slope * input.smNd1;
  const ageYears = Math.log(1 + slope) / LAMBDA_SM147_PER_YEAR;
  return {
    slope,
    initial143Nd144Nd,
    ageYears,
    ageMa: ageYears / 1e6,
  };
};

export const smNdIsochronExample = {
  input: { smNd1: 0.2, ndRatio1: 0.512, smNd2: 0.6, ndRatio2: 0.517 },
  output: {
    slope: 0.012500000000000013,
    initial143Nd144Nd: 0.5095,
    ageYears: 1899467889.6876316,
    ageMa: 1899.4678896876317,
  },
} satisfies ToolExample<SmNdIsochronInput, SmNdIsochronOutput>;

export const smNdIsochronTool = createSimpleTool({
  id: "geology/sm-nd-isochron",
  title: "Geology Sm Nd Isochron Calculator",
  description:
    "Fit a two-point Sm-Nd isochron and convert its slope to an age using the Sm-147 decay constant.",
  inputs: [
    {
      description: "147Sm/144Nd of the first point.",
      id: "smNd1",
      kind: "number",
      label: "147Sm/144Nd #1",
    },
    {
      description: "143Nd/144Nd of the first point.",
      id: "ndRatio1",
      kind: "number",
      label: "143Nd/144Nd #1",
    },
    {
      description: "147Sm/144Nd of the second point.",
      id: "smNd2",
      kind: "number",
      label: "147Sm/144Nd #2",
    },
    {
      description: "143Nd/144Nd of the second point.",
      id: "ndRatio2",
      kind: "number",
      label: "143Nd/144Nd #2",
    },
  ],
  outputs: [
    {
      description: "Isochron slope in 143Nd/144Nd per unit 147Sm/144Nd.",
      id: "slope",
      kind: "number",
      label: "Slope",
    },
    {
      description: "Initial 143Nd/144Nd from the intercept.",
      id: "initial143Nd144Nd",
      kind: "number",
      label: "Initial 143Nd/144Nd",
    },
    {
      description: "Isochron age in years.",
      id: "ageYears",
      kind: "number",
      label: "Age (yr)",
    },
    {
      description: "Isochron age in millions of years.",
      id: "ageMa",
      kind: "number",
      label: "Age (Ma)",
    },
  ],
  calculate: (input) =>
    calculateSmNdIsochron(input as unknown as SmNdIsochronInput),
});

export const runSmNdIsochron = smNdIsochronTool.execute;
export default smNdIsochronTool;
