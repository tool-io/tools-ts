import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PipeVolumeCylinderInput = Readonly<{
  readonly insideDiameterMm: number;
  readonly lengthM: number;
}>;
export type PipeVolumeCylinderOutput = Readonly<{
  readonly internalVolumeLiters: number;
}>;

export const calculatePipeVolumeCylinder = (
  x: PipeVolumeCylinderInput,
): PipeVolumeCylinderOutput => {
  if (!Number.isFinite(x.insideDiameterMm) || x.insideDiameterMm < 0)
    simpleError("insideDiameterMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthM) || x.lengthM < 0)
    simpleError("lengthM", "Provide a finite number at least 0.");
  const internalVolumeLiters =
    ((Math.PI * (x.insideDiameterMm / 1000) ** 2) / 4) * x.lengthM * 1000;
  if (!Number.isFinite(internalVolumeLiters))
    simpleError(
      "internalVolumeLiters",
      "The inputs produce an invalid result.",
    );
  return {
    internalVolumeLiters: Object.is(internalVolumeLiters, -0)
      ? 0
      : internalVolumeLiters,
  };
};

export const example = {
  input: { insideDiameterMm: 20, lengthM: 10 },
  output: { internalVolumeLiters: 3.1415926535897927 },
} satisfies ToolExample<PipeVolumeCylinderInput, PipeVolumeCylinderOutput>;

export const tool = createSimpleTool({
  id: "construction/pipe-volume-cylinder",
  title: "Pipe Volume Cylinder",
  description:
    "Calculate a straight pipe's internal capacity from its inside diameter and length; excludes fittings and wall volume.",
  inputs: [
    {
      id: "insideDiameterMm",
      kind: "number",
      label: "Inside diameter",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "lengthM",
      kind: "number",
      label: "Pipe length",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "internalVolumeLiters",
      kind: "number",
      label: "Internal capacity",
      unit: "L",
    },
  ],
  calculate: (input) =>
    calculatePipeVolumeCylinder({
      insideDiameterMm: input.insideDiameterMm as number,
      lengthM: input.lengthM as number,
    }),
});
export const pipeVolumeCylinderTool = tool;
export const runPipeVolumeCylinder = tool.execute;
export default tool;
