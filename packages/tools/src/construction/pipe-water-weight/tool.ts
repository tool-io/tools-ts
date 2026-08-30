import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PipeWaterWeightInput = Readonly<{
  readonly waterVolumeLiters: number;
  readonly waterDensityKgPerLiter: number;
}>;
export type PipeWaterWeightOutput = Readonly<{
  readonly waterMassKg: number;
}>;

export const calculatePipeWaterWeight = (
  x: PipeWaterWeightInput,
): PipeWaterWeightOutput => {
  if (!Number.isFinite(x.waterVolumeLiters) || x.waterVolumeLiters < 0)
    simpleError("waterVolumeLiters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.waterDensityKgPerLiter) ||
    x.waterDensityKgPerLiter < 0
  )
    simpleError(
      "waterDensityKgPerLiter",
      "Provide a finite number at least 0.",
    );
  const waterMassKg = x.waterVolumeLiters * x.waterDensityKgPerLiter;
  if (!Number.isFinite(waterMassKg))
    simpleError("waterMassKg", "The inputs produce an invalid result.");
  return { waterMassKg: Object.is(waterMassKg, -0) ? 0 : waterMassKg };
};

export const example = {
  input: { waterVolumeLiters: 10, waterDensityKgPerLiter: 1 },
  output: { waterMassKg: 10 },
} satisfies ToolExample<PipeWaterWeightInput, PipeWaterWeightOutput>;

export const tool = createSimpleTool({
  id: "construction/pipe-water-weight",
  title: "Pipe Water Weight",
  description:
    "Calculate mass of water contained in a pipe or vessel from filled volume and water density at the relevant temperature.",
  inputs: [
    {
      id: "waterVolumeLiters",
      kind: "number",
      label: "Filled water volume",
      unit: "L",
      minimum: 0,
    },
    {
      id: "waterDensityKgPerLiter",
      kind: "number",
      label: "Water density",
      unit: "kg/L",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "waterMassKg", kind: "number", label: "Water mass", unit: "kg" },
  ],
  calculate: (input) =>
    calculatePipeWaterWeight({
      waterVolumeLiters: input.waterVolumeLiters as number,
      waterDensityKgPerLiter: input.waterDensityKgPerLiter as number,
    }),
});
export const pipeWaterWeightTool = tool;
export const runPipeWaterWeight = tool.execute;
export default tool;
