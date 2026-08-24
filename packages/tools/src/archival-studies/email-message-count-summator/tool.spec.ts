import { describe, expect, it } from "vitest";
import {
  calculateEmailMessageCountSummator,
  emailMessageCountSummatorExample,
  runEmailMessageCountSummator,
} from "./tool.js";

describe("archival-studies/email-message-count-summator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEmailMessageCountSummator(emailMessageCountSummatorExample.input),
    ).toEqual({ ok: true, output: emailMessageCountSummatorExample.output });
  });

  it("handles a single account", () => {
    const result = calculateEmailMessageCountSummator({
      messageCounts: [42],
    });
    expect(result.accountCount).toBe(1);
    expect(result.totalMessages).toBe(42);
    expect(result.averagePerAccount).toBe(42);
  });

  it("rejects negative counts", () => {
    expect(runEmailMessageCountSummator({ messageCounts: [10, -1] }).ok).toBe(
      false,
    );
  });
});
