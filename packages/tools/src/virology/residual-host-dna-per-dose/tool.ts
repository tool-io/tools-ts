import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly hostDnaNgPerMl: number;
  readonly doseVolumeMl: number;
  readonly maximumNgPerDose: number;
}>;
export type Output = Readonly<{
  readonly hostDnaNgPerDose: number;
  readonly withinSuppliedLimit: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.hostDnaNgPerMl, "hostDnaNgPerMl");
  positive(input.doseVolumeMl, "doseVolumeMl");
  nonnegative(input.maximumNgPerDose, "maximumNgPerDose");
  const hostDnaNgPerDose = input.hostDnaNgPerMl * input.doseVolumeMl;
  return {
    hostDnaNgPerDose,
    withinSuppliedLimit: hostDnaNgPerDose <= input.maximumNgPerDose,
  };
};
export const exampleInput = {
  hostDnaNgPerMl: 5,
  doseVolumeMl: 0.5,
  maximumNgPerDose: 10,
} satisfies Input;
export const exampleOutput = {
  hostDnaNgPerDose: 2.5,
  withinSuppliedLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/residual-host-dna-per-dose",
  title: "Residual Host Dna Per Dose",
  description:
    "Convert residual host-cell DNA concentration to per-dose burden and screen a caller-supplied limit.",
  inputs: [
    {
      id: "hostDnaNgPerMl",
      label: "Host dna ng per ml",
      kind: "number",
      minimum: 0,
    },
    { id: "doseVolumeMl", label: "Dose volume ml", kind: "number" },
    {
      id: "maximumNgPerDose",
      label: "Maximum ng per dose",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "hostDnaNgPerDose", label: "Host dna ng per dose", kind: "number" },
    {
      id: "withinSuppliedLimit",
      label: "Within supplied limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      hostDnaNgPerMl: value.hostDnaNgPerMl as number,
      doseVolumeMl: value.doseVolumeMl as number,
      maximumNgPerDose: value.maximumNgPerDose as number,
    }),
});
export const run = tool.execute;
export default tool;
