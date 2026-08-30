import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly irradianceWPerCm2: number;
  readonly illuminationSeconds: number;
  readonly drugLightIntervalHours: number;
  readonly maximumIntervalHours: number;
}>;
export type Output = Readonly<{
  readonly lightDoseJPerCm2: number;
  readonly intervalMarginHours: number;
  readonly withinInterval: boolean;
}>;

export const calculate = (input: Input): Output => {
  const lightDoseJPerCm2 = input.irradianceWPerCm2 * input.illuminationSeconds;
  return {
    lightDoseJPerCm2,
    intervalMarginHours:
      input.maximumIntervalHours - input.drugLightIntervalHours,
    withinInterval: input.drugLightIntervalHours <= input.maximumIntervalHours,
  };
};

export const exampleInput = {
  irradianceWPerCm2: 0.1,
  illuminationSeconds: 100,
  drugLightIntervalHours: 2,
  maximumIntervalHours: 3,
} satisfies Input;
export const exampleOutput = {
  lightDoseJPerCm2: 10,
  intervalMarginHours: 1,
  withinInterval: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      irradianceWPerCm2: input.irradianceWPerCm2 as number,
      illuminationSeconds: input.illuminationSeconds as number,
      drugLightIntervalHours: input.drugLightIntervalHours as number,
      maximumIntervalHours: input.maximumIntervalHours as number,
    }),
  description:
    "Calculate PDT light dose and check a caller-supplied drug-to-light interval.",
  id: "laser/pdt-light-dose",
  inputs: [
    {
      id: "irradianceWPerCm2",
      label: "Treatment irradiance",
      kind: "number",
      minimum: 0,
      unit: "W/cm²",
    },
    {
      id: "illuminationSeconds",
      label: "Illumination duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "drugLightIntervalHours",
      label: "Drug-to-light interval",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "maximumIntervalHours",
      label: "Caller maximum interval",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      id: "lightDoseJPerCm2",
      label: "PDT light dose",
      kind: "number",
      minimum: 0,
      unit: "J/cm²",
    },
    {
      id: "intervalMarginHours",
      label: "Interval margin",
      kind: "number",
      unit: "h",
    },
    {
      id: "withinInterval",
      label: "Within supplied interval",
      kind: "boolean",
    },
  ],
  title: "PDT Light Dose",
});

export const run = tool.execute;
export default tool;
