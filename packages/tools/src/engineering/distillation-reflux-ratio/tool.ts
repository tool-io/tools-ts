import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DistillationRefluxRatioInput = Readonly<{
  readonly refluxMolesPerHour: number;
  readonly distillateMolesPerHour: number;
}>;
export type DistillationRefluxRatioOutput = Readonly<{
  readonly refluxRatio: number;
}>;

export const calculateDistillationRefluxRatio = (
  x: DistillationRefluxRatioInput,
): DistillationRefluxRatioOutput => {
  if (!Number.isFinite(x.refluxMolesPerHour) || x.refluxMolesPerHour < 0)
    simpleError("refluxMolesPerHour", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.distillateMolesPerHour) ||
    x.distillateMolesPerHour < 0
  )
    simpleError(
      "distillateMolesPerHour",
      "Provide a finite number at least 0.",
    );
  const refluxRatio = x.refluxMolesPerHour / x.distillateMolesPerHour;
  if (!Number.isFinite(refluxRatio))
    simpleError(
      "refluxRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { refluxRatio: Object.is(refluxRatio, -0) ? 0 : refluxRatio };
};

export const example = {
  input: { refluxMolesPerHour: 200, distillateMolesPerHour: 100 },
  output: { refluxRatio: 2 },
} satisfies ToolExample<
  DistillationRefluxRatioInput,
  DistillationRefluxRatioOutput
>;

export const tool = createSimpleTool({
  id: "engineering/distillation-reflux-ratio",
  title: "Distillation Reflux Ratio",
  description:
    "External distillation reflux ratio from liquid returned to the column divided by distillate product flow.",
  inputs: [
    {
      id: "refluxMolesPerHour",
      kind: "number",
      label: "Reflux Moles Per Hour",
      unit: "mol/h",
      minimum: 0,
    },
    {
      id: "distillateMolesPerHour",
      kind: "number",
      label: "Distillate Moles Per Hour",
      unit: "mol/h",
      minimum: 0,
    },
  ],
  outputs: [{ id: "refluxRatio", kind: "number", label: "Reflux Ratio" }],
  calculate: (input) =>
    calculateDistillationRefluxRatio({
      refluxMolesPerHour: input.refluxMolesPerHour as number,
      distillateMolesPerHour: input.distillateMolesPerHour as number,
    }),
});
export const distillationRefluxRatioTool = tool;
export const runDistillationRefluxRatio = tool.execute;
export default tool;
