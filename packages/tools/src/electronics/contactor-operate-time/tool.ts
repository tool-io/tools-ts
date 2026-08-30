import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContactorOperateTimeInput = Readonly<{
  readonly energizedMilliseconds: number;
  readonly closedMilliseconds: number;
}>;
export type ContactorOperateTimeOutput = Readonly<{
  readonly operateMilliseconds: number;
}>;

export const calculateContactorOperateTime = (
  x: ContactorOperateTimeInput,
): ContactorOperateTimeOutput => {
  if (!Number.isFinite(x.energizedMilliseconds) || x.energizedMilliseconds < 0)
    simpleError("energizedMilliseconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.closedMilliseconds) || x.closedMilliseconds < 0)
    simpleError("closedMilliseconds", "Provide a finite number at least 0.");
  if (x.closedMilliseconds < x.energizedMilliseconds)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const operateMilliseconds = x.closedMilliseconds - x.energizedMilliseconds;
  if (!Number.isFinite(operateMilliseconds))
    simpleError(
      "operateMilliseconds",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    operateMilliseconds: Object.is(operateMilliseconds, -0)
      ? 0
      : operateMilliseconds,
  };
};

export const example = {
  input: { energizedMilliseconds: 10, closedMilliseconds: 35 },
  output: { operateMilliseconds: 25 },
} satisfies ToolExample<ContactorOperateTimeInput, ContactorOperateTimeOutput>;

export const tool = createSimpleTool({
  id: "electronics/contactor-operate-time",
  title: "Contactor Operate Time",
  description:
    "Observed contactor operate delay from coil energization to completed contact closure.",
  inputs: [
    {
      id: "energizedMilliseconds",
      kind: "number",
      label: "Energized Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "closedMilliseconds",
      kind: "number",
      label: "Closed Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "operateMilliseconds",
      kind: "number",
      label: "Operate Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateContactorOperateTime({
      energizedMilliseconds: input.energizedMilliseconds as number,
      closedMilliseconds: input.closedMilliseconds as number,
    }),
});
export const contactorOperateTimeTool = tool;
export const runContactorOperateTime = tool.execute;
export default tool;
