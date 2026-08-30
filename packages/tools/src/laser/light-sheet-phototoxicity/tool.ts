import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly conventionalIrradianceWPerCm2: number;
  readonly conventionalExposureSeconds: number;
  readonly lightSheetIrradianceWPerCm2: number;
  readonly lightSheetExposureSeconds: number;
}>;
export type Output = Readonly<{
  readonly conventionalDoseJPerCm2: number;
  readonly lightSheetDoseJPerCm2: number;
  readonly doseReductionPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const conventionalDoseJPerCm2 =
    input.conventionalIrradianceWPerCm2 * input.conventionalExposureSeconds;
  if (conventionalDoseJPerCm2 <= 0)
    simpleError(
      "conventionalIrradianceWPerCm2",
      "Conventional dose must be positive.",
      "invalid_baseline",
    );
  const lightSheetDoseJPerCm2 =
    input.lightSheetIrradianceWPerCm2 * input.lightSheetExposureSeconds;
  return {
    conventionalDoseJPerCm2,
    lightSheetDoseJPerCm2,
    doseReductionPercent:
      (1 - lightSheetDoseJPerCm2 / conventionalDoseJPerCm2) * 100,
  };
};

export const exampleInput = {
  conventionalIrradianceWPerCm2: 2,
  conventionalExposureSeconds: 10,
  lightSheetIrradianceWPerCm2: 1,
  lightSheetExposureSeconds: 10,
} satisfies Input;
export const exampleOutput = {
  conventionalDoseJPerCm2: 20,
  lightSheetDoseJPerCm2: 10,
  doseReductionPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      conventionalIrradianceWPerCm2:
        input.conventionalIrradianceWPerCm2 as number,
      conventionalExposureSeconds: input.conventionalExposureSeconds as number,
      lightSheetIrradianceWPerCm2: input.lightSheetIrradianceWPerCm2 as number,
      lightSheetExposureSeconds: input.lightSheetExposureSeconds as number,
    }),
  description:
    "Compare light-sheet and conventional illumination dose as a phototoxicity proxy.",
  id: "laser/light-sheet-phototoxicity",
  inputs: [
    {
      id: "conventionalIrradianceWPerCm2",
      label: "Conventional irradiance",
      kind: "number",
      minimum: 0,
      unit: "W/cm²",
    },
    {
      id: "conventionalExposureSeconds",
      label: "Conventional exposure",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "lightSheetIrradianceWPerCm2",
      label: "Light-sheet irradiance",
      kind: "number",
      minimum: 0,
      unit: "W/cm²",
    },
    {
      id: "lightSheetExposureSeconds",
      label: "Light-sheet exposure",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "conventionalDoseJPerCm2",
      label: "Conventional dose",
      kind: "number",
      minimum: 0,
      unit: "J/cm²",
    },
    {
      id: "lightSheetDoseJPerCm2",
      label: "Light-sheet dose",
      kind: "number",
      minimum: 0,
      unit: "J/cm²",
    },
    {
      id: "doseReductionPercent",
      label: "Light-sheet dose reduction",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Light-Sheet Phototoxicity",
});

export const run = tool.execute;
export default tool;
