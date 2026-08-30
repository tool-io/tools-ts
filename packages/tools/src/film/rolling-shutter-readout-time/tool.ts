import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RollingShutterReadoutTimeInput = Readonly<{
  readonly activeRows: number;
  readonly lineMicroseconds: number;
}>;
export type RollingShutterReadoutTimeOutput = Readonly<{
  readonly readoutMilliseconds: number;
}>;

export const calculateRollingShutterReadoutTime = (
  x: RollingShutterReadoutTimeInput,
): RollingShutterReadoutTimeOutput => {
  if (!Number.isFinite(x.activeRows) || x.activeRows < 1)
    simpleError("activeRows", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.lineMicroseconds) || x.lineMicroseconds < 0)
    simpleError("lineMicroseconds", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.activeRows))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const readoutMilliseconds = (x.activeRows * x.lineMicroseconds) / 1000;
  if (!Number.isFinite(readoutMilliseconds))
    simpleError(
      "readoutMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    readoutMilliseconds: Object.is(readoutMilliseconds, -0)
      ? 0
      : readoutMilliseconds,
  };
};

export const example = {
  input: { activeRows: 1080, lineMicroseconds: 20 },
  output: { readoutMilliseconds: 21.6 },
} satisfies ToolExample<
  RollingShutterReadoutTimeInput,
  RollingShutterReadoutTimeOutput
>;

export const tool = createSimpleTool({
  id: "film/rolling-shutter-readout-time",
  title: "Rolling Shutter Readout Time",
  description:
    "Total row-by-row sensor readout time from active row count and time per line.",
  inputs: [
    { id: "activeRows", kind: "integer", label: "Active Rows", minimum: 1 },
    {
      id: "lineMicroseconds",
      kind: "number",
      label: "Line Microseconds",
      unit: "µs",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "readoutMilliseconds",
      kind: "number",
      label: "Readout Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateRollingShutterReadoutTime({
      activeRows: input.activeRows as number,
      lineMicroseconds: input.lineMicroseconds as number,
    }),
});
export const rollingShutterReadoutTimeTool = tool;
export const runRollingShutterReadoutTime = tool.execute;
export default tool;
