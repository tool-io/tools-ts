import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly acuteReciprocalTiter: number;
  readonly convalescentReciprocalTiter: number;
  readonly minimumFoldRise: number;
}>;
export type Output = Readonly<{
  readonly foldRise: number;
  readonly meetsSuppliedRiseCriterion: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.acuteReciprocalTiter, "acuteReciprocalTiter");
  positive(input.convalescentReciprocalTiter, "convalescentReciprocalTiter");
  positive(input.minimumFoldRise, "minimumFoldRise");
  const foldRise =
    input.convalescentReciprocalTiter / input.acuteReciprocalTiter;
  return {
    foldRise,
    meetsSuppliedRiseCriterion: foldRise >= input.minimumFoldRise,
  };
};
export const exampleInput = {
  acuteReciprocalTiter: 20,
  convalescentReciprocalTiter: 80,
  minimumFoldRise: 4,
} satisfies Input;
export const exampleOutput = {
  foldRise: 4,
  meetsSuppliedRiseCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/paired-hai-titer-rise",
  title: "Paired HAI Titer Rise",
  description:
    "Compare paired HAI reciprocal titers against a caller-defined rise criterion; does not establish acute infection independently.",
  inputs: [
    {
      id: "acuteReciprocalTiter",
      label: "Acute reciprocal titer",
      kind: "number",
    },
    {
      id: "convalescentReciprocalTiter",
      label: "Convalescent reciprocal titer",
      kind: "number",
    },
    { id: "minimumFoldRise", label: "Minimum fold rise", kind: "number" },
  ],
  outputs: [
    { id: "foldRise", label: "Fold rise", kind: "number" },
    {
      id: "meetsSuppliedRiseCriterion",
      label: "Meets supplied rise criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      acuteReciprocalTiter: value.acuteReciprocalTiter as number,
      convalescentReciprocalTiter: value.convalescentReciprocalTiter as number,
      minimumFoldRise: value.minimumFoldRise as number,
    }),
});
export const run = tool.execute;
export default tool;
