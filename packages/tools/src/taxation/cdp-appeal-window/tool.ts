import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly noticeDate: string;
  readonly appealWindowDays: number;
  readonly filingDate: string;
}>;
export type Output = Readonly<{
  readonly appealDeadline: string;
  readonly daysFromNotice: number;
  readonly filedWithinWindow: boolean;
}>;

export const calculate = (input: Input): Output => {
  const parse = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
      simpleError("noticeDate", "Dates must use YYYY-MM-DD.", "invalid_date");
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()))
      simpleError("noticeDate", "Date is invalid.", "invalid_date");
    return date;
  };
  const notice = parse(input.noticeDate),
    filing = parse(input.filingDate);
  const daysFromNotice = Math.floor(
    (filing.getTime() - notice.getTime()) / 86400000,
  );
  if (daysFromNotice < 0)
    simpleError(
      "filingDate",
      "Filing date cannot precede notice date.",
      "invalid_range",
    );
  const deadline = new Date(notice);
  deadline.setUTCDate(deadline.getUTCDate() + input.appealWindowDays);
  return {
    appealDeadline: deadline.toISOString().slice(0, 10),
    daysFromNotice,
    filedWithinWindow: daysFromNotice <= input.appealWindowDays,
  };
};

export const exampleInput = {
  noticeDate: "2025-01-01",
  appealWindowDays: 30,
  filingDate: "2025-01-20",
} satisfies Input;
export const exampleOutput = {
  appealDeadline: "2025-01-31",
  daysFromNotice: 19,
  filedWithinWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      noticeDate: input.noticeDate as string,
      appealWindowDays: input.appealWindowDays as number,
      filingDate: input.filingDate as string,
    }),
  description:
    "Check a collection appeal filing date against a caller-supplied window.",
  id: "taxation/cdp-appeal-window",
  inputs: [
    { id: "noticeDate", label: "Collection notice date", kind: "string" },
    {
      id: "appealWindowDays",
      label: "Appeal window",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    { id: "filingDate", label: "Appeal filing date", kind: "string" },
  ],
  outputs: [
    { id: "appealDeadline", label: "Appeal deadline", kind: "string" },
    {
      id: "daysFromNotice",
      label: "Days from notice",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "filedWithinWindow",
      label: "Filed within supplied window",
      kind: "boolean",
    },
  ],
  title: "CDP Appeal Window",
});

export const run = tool.execute;
export default tool;
