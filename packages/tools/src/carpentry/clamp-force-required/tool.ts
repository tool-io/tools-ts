import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClampForceRequiredInput = Readonly<{
  readonly targetPressureMpa: number;
  readonly glueLineAreaCm2: number;
}>;
export type ClampForceRequiredOutput = Readonly<{
  readonly totalClampForceN: number;
}>;

export const calculateClampForceRequired = (
  x: ClampForceRequiredInput,
): ClampForceRequiredOutput => {
  if (!Number.isFinite(x.targetPressureMpa) || x.targetPressureMpa < 0)
    simpleError("targetPressureMpa", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.glueLineAreaCm2) || x.glueLineAreaCm2 < 0)
    simpleError("glueLineAreaCm2", "Provide a finite number at least 0.");
  const totalClampForceN = 100 * x.targetPressureMpa * x.glueLineAreaCm2;
  if (!Number.isFinite(totalClampForceN))
    simpleError("totalClampForceN", "The inputs produce an invalid result.");
  return {
    totalClampForceN: Object.is(totalClampForceN, -0) ? 0 : totalClampForceN,
  };
};

export const example = {
  input: { targetPressureMpa: 0.5, glueLineAreaCm2: 100 },
  output: { totalClampForceN: 5000 },
} satisfies ToolExample<ClampForceRequiredInput, ClampForceRequiredOutput>;

export const tool = createSimpleTool({
  id: "carpentry/clamp-force-required",
  title: "Clamp Force Required",
  description:
    "Convert an adhesive manufacturer's target clamping pressure and glue-line area into total applied clamp force; excludes losses and uneven pressure.",
  inputs: [
    {
      id: "targetPressureMpa",
      kind: "number",
      label: "Target glue-line pressure",
      unit: "MPa",
      minimum: 0,
    },
    {
      id: "glueLineAreaCm2",
      kind: "number",
      label: "Glue-line area",
      unit: "cm²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalClampForceN",
      kind: "number",
      label: "Target total clamp force",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateClampForceRequired({
      targetPressureMpa: input.targetPressureMpa as number,
      glueLineAreaCm2: input.glueLineAreaCm2 as number,
    }),
});
export const clampForceRequiredTool = tool;
export const runClampForceRequired = tool.execute;
export default tool;
