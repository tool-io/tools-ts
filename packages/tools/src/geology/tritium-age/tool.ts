import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TritiumAgeInput = {
  readonly initialTritiumTU: number;
  readonly measuredTritiumTU: number;
  readonly halfLifeYears?: number;
};

export type TritiumAgeOutput = {
  readonly ageYears: number;
};

/**
 * Tritium decay: t = -(T1/2 / ln 2) ln(A/A0), with the standard
 * half-life of 12.32 years.
 */
export const calculateTritiumAge = (
  input: TritiumAgeInput,
): TritiumAgeOutput => {
  const halfLifeYears = input.halfLifeYears ?? 12.32;
  if (!(input.initialTritiumTU > 0))
    return simpleError(
      "initialTritiumTU",
      "The initial tritium activity must be greater than zero.",
      "invalid_activity",
    );
  if (!(input.measuredTritiumTU > 0))
    return simpleError(
      "measuredTritiumTU",
      "The measured tritium activity must be greater than zero.",
      "invalid_activity",
    );
  if (!(halfLifeYears > 0))
    return simpleError(
      "halfLifeYears",
      "The half-life must be greater than zero.",
      "invalid_half_life",
    );
  return {
    ageYears:
      -(halfLifeYears / Math.LN2) *
      Math.log(input.measuredTritiumTU / input.initialTritiumTU),
  };
};

export const tritiumAgeExample = {
  input: { initialTritiumTU: 20, measuredTritiumTU: 10, halfLifeYears: 12.32 },
  output: { ageYears: 12.32 },
} satisfies ToolExample<TritiumAgeInput, TritiumAgeOutput>;

export const tritiumAgeTool = createSimpleTool({
  id: "geology/tritium-age",
  title: "Geology Tritium Age Calculator",
  description:
    "Date groundwater from the decay of initial to measured tritium activity using a 12.32-year half-life.",
  inputs: [
    {
      description: "Initial tritium activity in tritium units (TU).",
      id: "initialTritiumTU",
      kind: "number",
      label: "Initial TU",
      minimum: 0,
    },
    {
      description: "Measured tritium activity in tritium units (TU).",
      id: "measuredTritiumTU",
      kind: "number",
      label: "Measured TU",
      minimum: 0,
    },
    {
      default: 12.32,
      description: "Tritium half-life in years.",
      id: "halfLifeYears",
      kind: "number",
      label: "Half-life",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Apparent tritium age in years.",
      id: "ageYears",
      kind: "number",
      label: "Age (yr)",
    },
  ],
  calculate: (input) =>
    calculateTritiumAge(input as unknown as TritiumAgeInput),
});

export const runTritiumAge = tritiumAgeTool.execute;
export default tritiumAgeTool;
