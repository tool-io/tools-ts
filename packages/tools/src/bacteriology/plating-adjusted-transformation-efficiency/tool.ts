import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly transformantColonies: number;
  readonly dnaMicrograms: number;
  readonly recoveryVolumeMl: number;
  readonly platedVolumeMl: number;
  readonly dilutionFraction: number;
}>;
export type Output = Readonly<{
  readonly estimatedTotalTransformants: number;
  readonly transformantsPerMicrogram: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.transformantColonies, "transformantColonies");
  positive(input.dnaMicrograms, "dnaMicrograms");
  positive(input.recoveryVolumeMl, "recoveryVolumeMl");
  positive(input.platedVolumeMl, "platedVolumeMl");
  fraction(input.dilutionFraction, "dilutionFraction");
  positive(input.dilutionFraction, "dilutionFraction");
  if (input.platedVolumeMl > input.recoveryVolumeMl)
    simpleError(
      "platedVolumeMl",
      "Plated aliquot cannot exceed total recovered suspension.",
    );
  const estimatedTotalTransformants =
    (input.transformantColonies * input.recoveryVolumeMl) /
    (input.platedVolumeMl * input.dilutionFraction);
  return {
    estimatedTotalTransformants,
    transformantsPerMicrogram:
      estimatedTotalTransformants / input.dnaMicrograms,
  };
};
export const exampleInput = {
  transformantColonies: 50,
  dnaMicrograms: 0.01,
  recoveryVolumeMl: 1,
  platedVolumeMl: 0.1,
  dilutionFraction: 1,
} satisfies Input;
export const exampleOutput = {
  estimatedTotalTransformants: 500,
  transformantsPerMicrogram: 50000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/plating-adjusted-transformation-efficiency",
  title: "Plating Adjusted Transformation Efficiency",
  description:
    "Estimate transformants per microgram from an aliquot plate, accounting for recovery volume and plate dilution.",
  inputs: [
    {
      id: "transformantColonies",
      label: "Transformant colonies",
      kind: "integer",
      minimum: 0,
    },
    { id: "dnaMicrograms", label: "Dna micrograms", kind: "number" },
    { id: "recoveryVolumeMl", label: "Recovery volume ml", kind: "number" },
    { id: "platedVolumeMl", label: "Plated volume ml", kind: "number" },
    {
      id: "dilutionFraction",
      label: "Dilution fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "estimatedTotalTransformants",
      label: "Estimated total transformants",
      kind: "number",
    },
    {
      id: "transformantsPerMicrogram",
      label: "Transformants per microgram",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      transformantColonies: value.transformantColonies as number,
      dnaMicrograms: value.dnaMicrograms as number,
      recoveryVolumeMl: value.recoveryVolumeMl as number,
      platedVolumeMl: value.platedVolumeMl as number,
      dilutionFraction: value.dilutionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
