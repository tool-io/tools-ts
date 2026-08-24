import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ImplantStraggleInput = {
  readonly projectedRangeNm: number;
  readonly straggleFraction: number;
};

export type ImplantStraggleOutput = {
  readonly straggleNm: number;
};

export const implantStraggleExample = {
  input: { projectedRangeNm: 100, straggleFraction: 0.35 },
  output: { straggleNm: 35 },
} satisfies ToolExample<ImplantStraggleInput, ImplantStraggleOutput>;

export const implantStraggleTool = createSimpleTool({
  calculate: (input) => {
    const projectedRangeNm = input.projectedRangeNm as number;
    if (projectedRangeNm <= 0)
      simpleError(
        "projectedRangeNm",
        "Projected range must be positive.",
        "degenerate_input",
      );
    return {
      straggleNm: (input.straggleFraction as number) * projectedRangeNm,
    };
  },
  description:
    "Compute the ion implantation straggle as a fraction of the projected range.",
  id: "semiconductor/ion-implantation-straggle",
  inputs: [
    {
      description: "Mean depth of the implanted profile.",
      id: "projectedRangeNm",
      kind: "number",
      label: "Projected range",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description:
        "Straggle to projected range ratio for the ion and target material.",
      id: "straggleFraction",
      kind: "number",
      label: "Straggle fraction",
      maximum: 1,
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Standard deviation of the implanted profile depth.",
      id: "straggleNm",
      kind: "number",
      label: "Straggle",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  title: "Implant Straggle Calculator",
});
export const runImplantStraggle = implantStraggleTool.execute;
export default implantStraggleTool;
