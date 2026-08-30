import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelayBounceTimeInput = Readonly<{
  readonly firstClosureMilliseconds: number;
  readonly lastTransitionMilliseconds: number;
}>;
export type RelayBounceTimeOutput = Readonly<{
  readonly bounceMilliseconds: number;
}>;

export const calculateRelayBounceTime = (
  x: RelayBounceTimeInput,
): RelayBounceTimeOutput => {
  if (
    !Number.isFinite(x.firstClosureMilliseconds) ||
    x.firstClosureMilliseconds < 0
  )
    simpleError(
      "firstClosureMilliseconds",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.lastTransitionMilliseconds) ||
    x.lastTransitionMilliseconds < 0
  )
    simpleError(
      "lastTransitionMilliseconds",
      "Provide a finite number at least 0.",
    );
  if (x.lastTransitionMilliseconds < x.firstClosureMilliseconds)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const bounceMilliseconds =
    x.lastTransitionMilliseconds - x.firstClosureMilliseconds;
  if (!Number.isFinite(bounceMilliseconds))
    simpleError(
      "bounceMilliseconds",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    bounceMilliseconds: Object.is(bounceMilliseconds, -0)
      ? 0
      : bounceMilliseconds,
  };
};

export const example = {
  input: { firstClosureMilliseconds: 10, lastTransitionMilliseconds: 13 },
  output: { bounceMilliseconds: 3 },
} satisfies ToolExample<RelayBounceTimeInput, RelayBounceTimeOutput>;

export const tool = createSimpleTool({
  id: "electronics/relay-bounce-time",
  title: "Relay Bounce Time",
  description:
    "Observed relay contact-bounce duration from first closure to last stable transition.",
  inputs: [
    {
      id: "firstClosureMilliseconds",
      kind: "number",
      label: "First Closure Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "lastTransitionMilliseconds",
      kind: "number",
      label: "Last Transition Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bounceMilliseconds",
      kind: "number",
      label: "Bounce Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateRelayBounceTime({
      firstClosureMilliseconds: input.firstClosureMilliseconds as number,
      lastTransitionMilliseconds: input.lastTransitionMilliseconds as number,
    }),
});
export const relayBounceTimeTool = tool;
export const runRelayBounceTime = tool.execute;
export default tool;
