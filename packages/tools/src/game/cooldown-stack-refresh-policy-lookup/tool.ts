import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned, at } from "../shared.js";
export type Input = Readonly<{
  readonly eventTimesSeconds: readonly number[];
  readonly eventDurationsSeconds: readonly number[];
  readonly refreshPolicy: string;
  readonly observedAtSeconds: number;
}>;
export type Output = Readonly<{
  readonly expiryAfterEachEventSeconds: readonly number[];
  readonly finalExpirySeconds: number;
  readonly remainingCooldownSeconds: number;
}>;
const inputFields = [
  { id: "eventTimesSeconds", label: "Event times seconds", kind: "numberList" },
  {
    id: "eventDurationsSeconds",
    label: "Event durations seconds",
    kind: "numberList",
  },
  { id: "refreshPolicy", label: "Refresh policy", kind: "string" },
  { id: "observedAtSeconds", label: "Observed at seconds", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.eventTimesSeconds.forEach((v) => nonnegative(v, "eventTimesSeconds"));
  input.eventDurationsSeconds.forEach((v) =>
    nonnegative(v, "eventDurationsSeconds"),
  );
  nonnegative(input.observedAtSeconds, "observedAtSeconds");
  aligned(
    input.eventTimesSeconds,
    input.eventDurationsSeconds,
    "eventTimesSeconds",
  );
  if (
    !["keep", "refresh", "extend"].includes(input.refreshPolicy) ||
    input.eventTimesSeconds.some(
      (v, i) => i > 0 && v < input.eventTimesSeconds[i - 1],
    ) ||
    input.observedAtSeconds < input.eventTimesSeconds.at(-1)!
  )
    simpleError(
      "events",
      "Nondecreasing event times before observation and explicit keep/refresh/extend policy required.",
    );
  let end = -1;
  const history = input.eventTimesSeconds.map((t, i) => {
    const d = input.eventDurationsSeconds[i];
    end =
      t >= end
        ? t + d
        : input.refreshPolicy === "keep"
          ? end
          : input.refreshPolicy === "refresh"
            ? t + d
            : end + d;
    return end;
  });
  return {
    expiryAfterEachEventSeconds: history,
    finalExpirySeconds: end,
    remainingCooldownSeconds: Math.max(0, end - input.observedAtSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eventTimesSeconds: [0, 5],
  eventDurationsSeconds: [10, 10],
  refreshPolicy: "refresh",
  observedAtSeconds: 6,
} satisfies Input;
export const exampleOutput = {
  expiryAfterEachEventSeconds: [10, 15],
  finalExpirySeconds: 15,
  remainingCooldownSeconds: 9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/cooldown-stack-refresh-policy-lookup",
  title: "Cooldown Stack Refresh Policy Lookup",
  description:
    "Replay explicit cooldown events under keep-current, reset-from-now or extend-expiry policy; expired cooldown starts anew, refresh may shorten remaining time, no hidden stacking charges or game-specific rules.",
  inputs: inputFields,
  outputs: [
    {
      id: "expiryAfterEachEventSeconds",
      label: "Expiry after each event seconds",
      kind: "numberList",
    },
    { id: "finalExpirySeconds", label: "Final expiry seconds", kind: "number" },
    {
      id: "remainingCooldownSeconds",
      label: "Remaining cooldown seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eventTimesSeconds: value.eventTimesSeconds as readonly number[],
      eventDurationsSeconds: value.eventDurationsSeconds as readonly number[],
      refreshPolicy: value.refreshPolicy as string,
      observedAtSeconds: value.observedAtSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
