import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PostcensalIntercensalEstimatorInput = {
  readonly mode?: "postcensal" | "intercensal";
  readonly basePopulation: number;
  readonly births?: number;
  readonly deaths?: number;
  readonly netMigration?: number;
  readonly endPopulation?: number;
  readonly fractionElapsed?: number;
};

export type PostcensalIntercensalEstimatorOutput = {
  readonly estimatedPopulation: number;
};

export const calculatePostcensalIntercensalEstimator = (
  input: PostcensalIntercensalEstimatorInput,
): PostcensalIntercensalEstimatorOutput => {
  if (!(input.basePopulation >= 0))
    return simpleError(
      "basePopulation",
      "The base population must be non-negative.",
      "invalid_population",
    );
  const mode = input.mode ?? "postcensal";
  if (mode === "postcensal") {
    const births = input.births ?? 0;
    const deaths = input.deaths ?? 0;
    const netMigration = input.netMigration ?? 0;
    if (!(Number.isFinite(births) && births >= 0))
      return simpleError(
        "births",
        "Births must be finite and non-negative.",
        "invalid_count",
      );
    if (!(Number.isFinite(deaths) && deaths >= 0))
      return simpleError(
        "deaths",
        "Deaths must be finite and non-negative.",
        "invalid_count",
      );
    if (!Number.isFinite(netMigration))
      return simpleError(
        "netMigration",
        "Net migration must be finite.",
        "invalid_count",
      );
    const estimatedPopulation =
      input.basePopulation + births - deaths + netMigration;
    if (estimatedPopulation < 0)
      return simpleError(
        "netMigration",
        "The demographic components cannot produce a negative population estimate.",
        "invalid_population",
      );
    return { estimatedPopulation };
  }
  if (input.endPopulation === undefined)
    return simpleError(
      "endPopulation",
      "Intercensal interpolation requires the later census population.",
      "missing_end_population",
    );
  if (!(input.endPopulation >= 0))
    return simpleError(
      "endPopulation",
      "The later census population must be non-negative.",
      "invalid_population",
    );
  const fractionElapsed = input.fractionElapsed ?? 0.5;
  if (!(fractionElapsed >= 0 && fractionElapsed <= 1))
    return simpleError(
      "fractionElapsed",
      "The elapsed fraction of the interval must lie between zero and one.",
      "invalid_fraction",
    );
  return {
    estimatedPopulation:
      input.basePopulation +
      (input.endPopulation - input.basePopulation) * fractionElapsed,
  };
};

export const postcensalIntercensalEstimatorExample = {
  input: {
    basePopulation: 1000000,
    births: 45000,
    deaths: 25000,
    netMigration: 8000,
  },
  output: { estimatedPopulation: 1028000 },
} satisfies ToolExample<
  PostcensalIntercensalEstimatorInput,
  PostcensalIntercensalEstimatorOutput
>;

export const postcensalIntercensalEstimatorTool = createSimpleTool({
  id: "demography/postcensal-intercensal-estimator",
  title: "Postcensal Intercensal Estimator",
  description:
    "Produce a postcensal estimate by the component method (base plus births minus deaths plus net migration since the census) or an intercensal estimate by linear interpolation between two censuses at a stated fraction of the interval.",
  inputs: [
    {
      default: "postcensal",
      description:
        "Component update after a census, or interpolation between two censuses.",
      enum: ["postcensal", "intercensal"],
      id: "mode",
      kind: "string",
      label: "Mode",
    },
    {
      description:
        "Most recent census population (or earlier-census population in intercensal mode).",
      id: "basePopulation",
      kind: "number",
      label: "Base population",
      minimum: 0,
    },
    {
      default: 0,
      description: "Births registered since the base date (postcensal mode).",
      id: "births",
      kind: "number",
      label: "Births",
      minimum: 0,
    },
    {
      default: 0,
      description: "Deaths registered since the base date (postcensal mode).",
      id: "deaths",
      kind: "number",
      label: "Deaths",
      minimum: 0,
    },
    {
      default: 0,
      description:
        "Net migration since the base date; may be negative (postcensal mode).",
      id: "netMigration",
      kind: "number",
      label: "Net migration",
    },
    {
      description: "Later census population (intercensal mode only).",
      id: "endPopulation",
      kind: "number",
      label: "End population",
      minimum: 0,
      required: false,
    },
    {
      default: 0.5,
      description:
        "Fraction of the interval elapsed from the earlier census (intercensal mode).",
      id: "fractionElapsed",
      kind: "number",
      label: "Fraction elapsed",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated population at the requested date.",
      id: "estimatedPopulation",
      kind: "number",
      label: "Estimate",
    },
  ],
  calculate: (input) =>
    calculatePostcensalIntercensalEstimator(
      input as unknown as PostcensalIntercensalEstimatorInput,
    ),
});

export const runPostcensalIntercensalEstimator =
  postcensalIntercensalEstimatorTool.execute;
export default postcensalIntercensalEstimatorTool;
