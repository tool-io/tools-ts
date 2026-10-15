import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
  daysBetween,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly isoUtcTimestamp: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "isoUtcTimestamp", label: "Iso utc timestamp", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$(?![\s\S])/.test(i.isoUtcTimestamp)
  )
    simpleError("timestamp", "Explicit second-precision ISO UTC timestamp.");
  daysBetween(i.isoUtcTimestamp.slice(0, 10), i.isoUtcTimestamp.slice(0, 10));
  const h = Number(i.isoUtcTimestamp.slice(11, 13)),
    m = Number(i.isoUtcTimestamp.slice(14, 16)),
    s = Number(i.isoUtcTimestamp.slice(17, 19));
  bounded(h, "hour", 0, 23);
  bounded(m, "minute", 0, 59);
  bounded(s, "second", 0, 59);
  return { secondsUntilNextUtcMidnight: 86400 - h * 3600 - m * 60 - s };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { isoUtcTimestamp: "2026-01-01T23:59:59Z" },
  output: { result: { secondsUntilNextUtcMidnight: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/daily-quest-reset-utc-midnight-seconds",
  title: "Daily Reset UTC Midnight Seconds Until",
  description:
    "Seconds until strictly next UTC midnight from caller timestamp, exact midnight returns 86400; no wall-clock read or game-server reset assertion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { secondsUntilNextUtcMidnight: { type: "number" } },
        required: ["secondsUntilNextUtcMidnight"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
