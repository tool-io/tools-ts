import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateToastNotificationBurst,
  runToastNotificationBurst,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateToastNotificationBurst, example);
    expect(runToastNotificationBurst(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, duration: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "duration", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected burst");
    expect(result.output.events[1]?.id).toBe(result.output.events[0]?.id);
    for (const e of result.output.events) {
      expect(e.expires - e.arrival).toBe(4);
      if (e.dismissedAt !== null) {
        expect(e.dismissedAt).toBeGreaterThanOrEqual(e.arrival);
        expect(e.dismissedAt).toBeLessThanOrEqual(e.expires);
      }
    }
  });
});
