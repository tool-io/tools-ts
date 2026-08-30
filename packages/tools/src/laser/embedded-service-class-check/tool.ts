import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly embeddedPowerWatts: number;
  readonly enclosureAttenuationDb: number;
  readonly accessiblePowerLimitWatts: number;
}>;
export type Output = Readonly<{
  readonly accessiblePowerWatts: number;
  readonly limitMarginWatts: number;
  readonly withinAccessibleLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const accessiblePowerWatts =
    input.embeddedPowerWatts * 10 ** (-input.enclosureAttenuationDb / 10);
  return {
    accessiblePowerWatts,
    limitMarginWatts: input.accessiblePowerLimitWatts - accessiblePowerWatts,
    withinAccessibleLimit:
      accessiblePowerWatts <= input.accessiblePowerLimitWatts,
  };
};

export const exampleInput = {
  embeddedPowerWatts: 1,
  enclosureAttenuationDb: 20,
  accessiblePowerLimitWatts: 0.02,
} satisfies Input;
export const exampleOutput = {
  accessiblePowerWatts: 0.01,
  limitMarginWatts: 0.01,
  withinAccessibleLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      embeddedPowerWatts: input.embeddedPowerWatts as number,
      enclosureAttenuationDb: input.enclosureAttenuationDb as number,
      accessiblePowerLimitWatts: input.accessiblePowerLimitWatts as number,
    }),
  description:
    "Estimate enclosure-accessible power and compare it with a caller-supplied class limit.",
  id: "laser/embedded-service-class-check",
  inputs: [
    {
      id: "embeddedPowerWatts",
      label: "Embedded laser power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "enclosureAttenuationDb",
      label: "Enclosure attenuation",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
    {
      id: "accessiblePowerLimitWatts",
      label: "Caller accessible-power limit",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "accessiblePowerWatts",
      label: "Estimated accessible power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "limitMarginWatts",
      label: "Accessible-power margin",
      kind: "number",
      unit: "W",
    },
    {
      id: "withinAccessibleLimit",
      label: "Within supplied accessible limit",
      kind: "boolean",
    },
  ],
  title: "Embedded-Service Class Check",
});

export const run = tool.execute;
export default tool;
