import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  safeCeil,
  afterWork,
} from "../shared.js";
export type Input = Readonly<{
  readonly requestStartDayOrdinal: number;
  readonly queuedScanPagesBeforeRequest: number;
  readonly requestScanPages: number;
  readonly callerAcceptedPagesPerProductiveDay: number;
  readonly suppliedProductiveDayOrdinals: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredWholeProductiveDaysIncludingQueue: number;
  readonly modeledRequestCompletionOrdinal: number;
  readonly completionWithinSuppliedCalendar: boolean;
}>;
const inputFields = [
  {
    id: "requestStartDayOrdinal",
    label: "Request start day ordinal",
    kind: "integer",
  },
  {
    id: "queuedScanPagesBeforeRequest",
    label: "Queued scan pages before request",
    kind: "integer",
  },
  { id: "requestScanPages", label: "Request scan pages", kind: "integer" },
  {
    id: "callerAcceptedPagesPerProductiveDay",
    label: "Caller accepted pages per productive day",
    kind: "number",
  },
  {
    id: "suppliedProductiveDayOrdinals",
    label: "Supplied productive day ordinals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerAcceptedPagesPerProductiveDay,
    "callerAcceptedPagesPerProductiveDay",
  );
  count(input.requestStartDayOrdinal, "requestStartDayOrdinal");
  count(input.queuedScanPagesBeforeRequest, "queuedScanPagesBeforeRequest");
  count(input.requestScanPages, "requestScanPages");
  const pages = count(
      input.queuedScanPagesBeforeRequest + input.requestScanPages,
      "pages",
    ),
    days = safeCeil(pages / input.callerAcceptedPagesPerProductiveDay, "days"),
    end = afterWork(
      input.requestStartDayOrdinal,
      days,
      input.suppliedProductiveDayOrdinals,
    );
  return {
    requiredWholeProductiveDaysIncludingQueue: days,
    modeledRequestCompletionOrdinal: end,
    completionWithinSuppliedCalendar: end !== -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requestStartDayOrdinal: 10,
  queuedScanPagesBeforeRequest: 20,
  requestScanPages: 10,
  callerAcceptedPagesPerProductiveDay: 10,
  suppliedProductiveDayOrdinals: [11, 12, 15, 16],
} satisfies Input;
export const exampleOutput = {
  requiredWholeProductiveDaysIncludingQueue: 3,
  modeledRequestCompletionOrdinal: 15,
  completionWithinSuppliedCalendar: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/scan-demand-turnaround-estimator",
  title: "Scan-on-Demand Turnaround Business Days Estimator",
  description:
    "Schedule caller FIFO scan demand including known queued pages on actual productive-day calendar, without assuming weekends/holidays or guaranteed turnaround.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredWholeProductiveDaysIncludingQueue",
      label: "Required whole productive days including queue",
      kind: "number",
    },
    {
      id: "modeledRequestCompletionOrdinal",
      label: "Modeled request completion ordinal",
      kind: "number",
    },
    {
      id: "completionWithinSuppliedCalendar",
      label: "Completion within supplied calendar",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      requestStartDayOrdinal: value.requestStartDayOrdinal as number,
      queuedScanPagesBeforeRequest:
        value.queuedScanPagesBeforeRequest as number,
      requestScanPages: value.requestScanPages as number,
      callerAcceptedPagesPerProductiveDay:
        value.callerAcceptedPagesPerProductiveDay as number,
      suppliedProductiveDayOrdinals:
        value.suppliedProductiveDayOrdinals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
