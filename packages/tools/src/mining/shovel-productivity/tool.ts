import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly bucketLooseVolumeM3: number;
  readonly bucketFillFraction: number;
  readonly looseDensityTonnesPerM3: number;
  readonly passCycleSeconds: number;
  readonly operatingEfficiency: number;
}>;
export type Output = Readonly<{
  readonly tonnesPerPass: number;
  readonly scheduledTonnesPerHour: number;
}>;
const inputFields = [
  {
    id: "bucketLooseVolumeM3",
    label: "Bucket loose volume m3",
    kind: "number",
  },
  { id: "bucketFillFraction", label: "Bucket fill fraction", kind: "number" },
  {
    id: "looseDensityTonnesPerM3",
    label: "Loose density tonnes per m3",
    kind: "number",
  },
  { id: "passCycleSeconds", label: "Pass cycle seconds", kind: "number" },
  { id: "operatingEfficiency", label: "Operating efficiency", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bucketLooseVolumeM3, "bucketLooseVolumeM3");
  positive(input.looseDensityTonnesPerM3, "looseDensityTonnesPerM3");
  positive(input.passCycleSeconds, "passCycleSeconds");
  fraction(input.bucketFillFraction, "bucketFillFraction");
  fraction(input.operatingEfficiency, "operatingEfficiency");
  const tonnesPerPass =
    input.bucketLooseVolumeM3 *
    input.bucketFillFraction *
    input.looseDensityTonnesPerM3;
  return {
    tonnesPerPass,
    scheduledTonnesPerHour:
      ((tonnesPerPass * 3600) / input.passCycleSeconds) *
      input.operatingEfficiency,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bucketLooseVolumeM3: 10,
  bucketFillFraction: 0.8,
  looseDensityTonnesPerM3: 1.5,
  passCycleSeconds: 30,
  operatingEfficiency: 0.5,
} satisfies Input;
export const exampleOutput = {
  tonnesPerPass: 12,
  scheduledTonnesPerHour: 720,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/shovel-productivity",
  title: "Shovel Productivity",
  description:
    "Estimate tonnes/pass and scheduled shovel throughput using loose density and fill; no bank/loose conversion is silently assumed.",
  inputs: inputFields,
  outputs: [
    { id: "tonnesPerPass", label: "Tonnes per pass", kind: "number" },
    {
      id: "scheduledTonnesPerHour",
      label: "Scheduled tonnes per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      bucketLooseVolumeM3: value.bucketLooseVolumeM3 as number,
      bucketFillFraction: value.bucketFillFraction as number,
      looseDensityTonnesPerM3: value.looseDensityTonnesPerM3 as number,
      passCycleSeconds: value.passCycleSeconds as number,
      operatingEfficiency: value.operatingEfficiency as number,
    }),
});
export const run = tool.execute;
export default tool;
