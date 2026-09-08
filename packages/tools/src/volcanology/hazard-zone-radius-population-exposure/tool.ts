import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  integer,
  aligned,
  binary,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerAlreadyMappedZonePopulationCounts: readonly number[];
  readonly callerIndependentlyComputedPopulationExposureFractions: readonly number[];
  readonly knownExposureGeometryFlags: readonly number[];
  readonly callerDocumentedNominalHazardRadiusM: number;
}>;
export type Output = Readonly<{
  readonly knownExposedPopulationEquivalent: number;
  readonly unassessedPopulationCount: number;
  readonly documentedNominalRadiusM: number;
}>;
const inputFields = [
  {
    id: "callerAlreadyMappedZonePopulationCounts",
    label: "Caller already mapped zone population counts",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyComputedPopulationExposureFractions",
    label: "Caller independently computed population exposure fractions",
    kind: "numberList",
  },
  {
    id: "knownExposureGeometryFlags",
    label: "Known exposure geometry flags",
    kind: "numberList",
  },
  {
    id: "callerDocumentedNominalHazardRadiusM",
    label: "Caller documented nominal hazard radius m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerAlreadyMappedZonePopulationCounts.forEach((v) =>
    nonnegative(v, "callerAlreadyMappedZonePopulationCounts"),
  );
  nonnegative(
    input.callerDocumentedNominalHazardRadiusM,
    "callerDocumentedNominalHazardRadiusM",
  );
  input.callerIndependentlyComputedPopulationExposureFractions.forEach((v) =>
    fraction(v, "callerIndependentlyComputedPopulationExposureFractions"),
  );
  binary(input.knownExposureGeometryFlags, "knownExposureGeometryFlags");
  aligned(
    input.callerAlreadyMappedZonePopulationCounts,
    input.callerIndependentlyComputedPopulationExposureFractions,
    "callerAlreadyMappedZonePopulationCounts",
  );
  aligned(
    input.callerAlreadyMappedZonePopulationCounts,
    input.knownExposureGeometryFlags,
    "callerAlreadyMappedZonePopulationCounts",
  );
  input.callerAlreadyMappedZonePopulationCounts.forEach((v) =>
    integer(v, "population"),
  );
  return {
    knownExposedPopulationEquivalent: sum(
      input.callerAlreadyMappedZonePopulationCounts.map((v, i) =>
        input.knownExposureGeometryFlags[i]
          ? v * input.callerIndependentlyComputedPopulationExposureFractions[i]
          : 0,
      ),
    ),
    unassessedPopulationCount: sum(
      input.callerAlreadyMappedZonePopulationCounts.filter(
        (_, i) => !input.knownExposureGeometryFlags[i],
      ),
    ),
    documentedNominalRadiusM: input.callerDocumentedNominalHazardRadiusM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAlreadyMappedZonePopulationCounts: [100, 200],
  callerIndependentlyComputedPopulationExposureFractions: [0.5, 0.25],
  knownExposureGeometryFlags: [1, 0],
  callerDocumentedNominalHazardRadiusM: 1000,
} satisfies Input;
export const exampleOutput = {
  knownExposedPopulationEquivalent: 50,
  unassessedPopulationCount: 200,
  documentedNominalRadiusM: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/hazard-zone-radius-population-exposure",
  title: "Hazard Zone Radius Population Exposure Calculator",
  description:
    "Audit independently mapped population-weighted overlap fractions for caller documented zone, NOT area-fraction→population assumption, geodesy mapping or recommended exclusion radius. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownExposedPopulationEquivalent",
      label: "Known exposed population equivalent",
      kind: "number",
    },
    {
      id: "unassessedPopulationCount",
      label: "Unassessed population count",
      kind: "number",
    },
    {
      id: "documentedNominalRadiusM",
      label: "Documented nominal radius m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAlreadyMappedZonePopulationCounts:
        value.callerAlreadyMappedZonePopulationCounts as readonly number[],
      callerIndependentlyComputedPopulationExposureFractions:
        value.callerIndependentlyComputedPopulationExposureFractions as readonly number[],
      knownExposureGeometryFlags:
        value.knownExposureGeometryFlags as readonly number[],
      callerDocumentedNominalHazardRadiusM:
        value.callerDocumentedNominalHazardRadiusM as number,
    }),
});
export const run = tool.execute;
export default tool;
