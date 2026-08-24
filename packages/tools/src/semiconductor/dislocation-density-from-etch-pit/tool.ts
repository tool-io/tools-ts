import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DislocationDensityFromEtchPitInput = {
  readonly pitCount: number;
  readonly fieldAreaUm2: number;
};

export type DislocationDensityFromEtchPitOutput = {
  readonly dislocationDensityPerCm2: number;
};

export const dislocationDensityFromEtchPitExample = {
  input: { pitCount: 100, fieldAreaUm2: 250 },
  output: { dislocationDensityPerCm2: 40000000 },
} satisfies ToolExample<
  DislocationDensityFromEtchPitInput,
  DislocationDensityFromEtchPitOutput
>;

export const calculateDislocationDensityFromEtchPit = (
  input: DislocationDensityFromEtchPitInput,
): DislocationDensityFromEtchPitOutput => {
  const pitCount = input.pitCount;
  const fieldAreaUm2 = input.fieldAreaUm2;

  if (
    !Number.isFinite(pitCount) ||
    !Number.isSafeInteger(pitCount) ||
    pitCount < 0
  )
    simpleError(
      "pitCount",
      "Pit count must be a finite safe integer at least 0.",
      "invalid_pit_count",
    );
  if (!Number.isFinite(fieldAreaUm2) || fieldAreaUm2 <= 0)
    simpleError(
      "fieldAreaUm2",
      "Field area must be a finite positive number greater than 0 µm².",
      "invalid_field_area",
    );

  if (pitCount === 0) return { dislocationDensityPerCm2: 0 };

  const areaCm2 = fieldAreaUm2 * 1e-8;
  if (!Number.isFinite(areaCm2) || areaCm2 <= 0)
    simpleError(
      "fieldAreaUm2",
      "Field area conversion overflowed.",
      "numeric_overflow",
    );

  const dislocationDensityPerCm2 = pitCount / areaCm2;
  if (!Number.isFinite(dislocationDensityPerCm2))
    simpleError(
      "fieldAreaUm2",
      "Dislocation density could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return {
    dislocationDensityPerCm2:
      dislocationDensityPerCm2 === 0 ? 0 : dislocationDensityPerCm2,
  };
};

export const dislocationDensityFromEtchPitTool = createSimpleTool({
  calculate: (input) =>
    calculateDislocationDensityFromEtchPit({
      pitCount: input.pitCount as number,
      fieldAreaUm2: input.fieldAreaUm2 as number,
    }),
  description:
    "Convert a counted number of etch pits on a measured field area into a dislocation density per square centimeter. Formula: D [1/cm²] = N / (A [µm²]·1e-8), where 1 µm² = 1e-8 cm², N is integer pit count ≥0, A>0 µm². Output D≥0 1/cm²; D=0 when N=0. Assumes each pit corresponds to one threading dislocation, uniform distribution, and accurate field area measurement.",
  id: "semiconductor/dislocation-density-from-etch-pit",
  inputs: [
    {
      description:
        "Number of etch pits counted on the field. Must be a safe integer at least 0; 0 yields 0 density.",
      id: "pitCount",
      kind: "integer",
      label: "Pit count",
      minimum: 0,
    },
    {
      description:
        "Measured field area under the microscope. Must be greater than 0 µm².",
      id: "fieldAreaUm2",
      kind: "number",
      label: "Field area",
      minimum: Number.MIN_VALUE,
      unit: "µm²",
    },
  ],
  outputs: [
    {
      description:
        "Dislocation density derived from the etch pit count. At least 0 1/cm².",
      id: "dislocationDensityPerCm2",
      kind: "number",
      label: "Dislocation density",
      minimum: 0,
      unit: "1/cm²",
    },
  ],
  title: "Dislocation Density from Etch Pits",
});
export const runDislocationDensityFromEtchPit =
  dislocationDensityFromEtchPitTool.execute;
export default dislocationDensityFromEtchPitTool;
