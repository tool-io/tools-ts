import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly bookkeepingHours: number;
  readonly taxHours: number;
  readonly otherNonattestHours: number;
  readonly exceptionHourLimit: number;
}>;
export type Output = Readonly<{
  readonly totalNonattestHours: number;
  readonly hoursAboveLimit: number;
  readonly withinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const totalNonattestHours =
    input.bookkeepingHours + input.taxHours + input.otherNonattestHours;
  return {
    totalNonattestHours,
    hoursAboveLimit: Math.max(
      0,
      totalNonattestHours - input.exceptionHourLimit,
    ),
    withinLimit: totalNonattestHours <= input.exceptionHourLimit,
  };
};

export const exampleInput = {
  bookkeepingHours: 4,
  taxHours: 3,
  otherNonattestHours: 2,
  exceptionHourLimit: 10,
} satisfies Input;
export const exampleOutput = {
  totalNonattestHours: 9,
  hoursAboveLimit: 0,
  withinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      bookkeepingHours: input.bookkeepingHours as number,
      taxHours: input.taxHours as number,
      otherNonattestHours: input.otherNonattestHours as number,
      exceptionHourLimit: input.exceptionHourLimit as number,
    }),
  description:
    "Total nonattest service hours against a caller-supplied exception limit.",
  id: "auditing/nonattest-hours-threshold",
  inputs: [
    {
      id: "bookkeepingHours",
      label: "Bookkeeping hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "taxHours",
      label: "Tax-service hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "otherNonattestHours",
      label: "Other nonattest hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "exceptionHourLimit",
      label: "Caller exception limit",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      id: "totalNonattestHours",
      label: "Total nonattest hours",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "hoursAboveLimit",
      label: "Hours above limit",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    { id: "withinLimit", label: "Within supplied limit", kind: "boolean" },
  ],
  title: "Nonattest Hours Threshold",
});

export const run = tool.execute;
export default tool;
