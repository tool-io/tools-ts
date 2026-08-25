import { describe, expect, it } from "vitest";
import {
  failedAttemptRetryScheduleLookupExample,
  runFailedAttemptRetryScheduleLookup,
} from "./tool.js";

describe("failed-attempt-retry-schedule-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFailedAttemptRetryScheduleLookup(
        failedAttemptRetryScheduleLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: failedAttemptRetryScheduleLookupExample.output,
    });
  });

  it("schedules a return once three attempts have failed", () => {
    expect(
      runFailedAttemptRetryScheduleLookup({ failedAttemptsSoFar: 3 }),
    ).toEqual({ ok: true, output: { nextAction: "return-to-terminal" } });
    expect(
      runFailedAttemptRetryScheduleLookup({ failedAttemptsSoFar: 9 }),
    ).toEqual({ ok: true, output: { nextAction: "return-to-terminal" } });
  });

  it("rejects negative attempt counts", () => {
    expect(
      runFailedAttemptRetryScheduleLookup({ failedAttemptsSoFar: -1 }).ok,
    ).toBe(false);
  });
});
