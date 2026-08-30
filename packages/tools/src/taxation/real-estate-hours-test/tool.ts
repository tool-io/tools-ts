import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly realPropertyTradeHours: number;
  readonly allPersonalServiceHours: number;
  readonly minimumRealPropertyHours: number;
}>;
export type Output = Readonly<{
  readonly realPropertySharePercent: number;
  readonly meetsHourThreshold: boolean;
  readonly moreThanHalfOfService: boolean;
  readonly meetsBothTests: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.allPersonalServiceHours <= 0 ||
    input.realPropertyTradeHours > input.allPersonalServiceHours
  )
    simpleError(
      "allPersonalServiceHours",
      "Total service hours must be positive and at least real-property hours.",
      "invalid_hours",
    );
  const realPropertySharePercent =
    (input.realPropertyTradeHours / input.allPersonalServiceHours) * 100;
  const meetsHourThreshold =
    input.realPropertyTradeHours >= input.minimumRealPropertyHours;
  const moreThanHalfOfService = realPropertySharePercent > 50;
  return {
    realPropertySharePercent,
    meetsHourThreshold,
    moreThanHalfOfService,
    meetsBothTests: meetsHourThreshold && moreThanHalfOfService,
  };
};

export const exampleInput = {
  realPropertyTradeHours: 800,
  allPersonalServiceHours: 1200,
  minimumRealPropertyHours: 750,
} satisfies Input;
export const exampleOutput = {
  realPropertySharePercent: 66.66666666666666,
  meetsHourThreshold: true,
  moreThanHalfOfService: true,
  meetsBothTests: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      realPropertyTradeHours: input.realPropertyTradeHours as number,
      allPersonalServiceHours: input.allPersonalServiceHours as number,
      minimumRealPropertyHours: input.minimumRealPropertyHours as number,
    }),
  description:
    "Compare real-property hours with caller-supplied hour and service-share tests.",
  id: "taxation/real-estate-hours-test",
  inputs: [
    {
      id: "realPropertyTradeHours",
      label: "Real-property trade hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "allPersonalServiceHours",
      label: "All personal-service hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "minimumRealPropertyHours",
      label: "Minimum real-property hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      id: "realPropertySharePercent",
      label: "Real-property hour share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "meetsHourThreshold",
      label: "Meets hour threshold",
      kind: "boolean",
    },
    {
      id: "moreThanHalfOfService",
      label: "More than half of service",
      kind: "boolean",
    },
    { id: "meetsBothTests", label: "Meets both tests", kind: "boolean" },
  ],
  title: "Real-Estate Hours Test",
});

export const run = tool.execute;
export default tool;
