import { describe, expect, it } from "vitest";
import {
  lookupUltrasonicWatchPartsCycle,
  runUltrasonicCycle,
  ultrasonicCycleExample,
} from "./tool.js";

describe("ultrasonic watch-parts cycle-stage lookup", () => {
  it("reproduces the canonical no-universal-settings example", () => {
    expect(runUltrasonicCycle(ultrasonicCycleExample.input)).toEqual({
      ok: true,
      output: ultrasonicCycleExample.output,
    });
  });

  it("covers component compatibility", () => {
    expect(
      lookupUltrasonicWatchPartsCycle({ cycleFocus: "partCompatibility" })
        .keyConcern,
    ).toContain("Sealed");
  });

  it("covers basket and tank-bottom contact", () => {
    expect(
      lookupUltrasonicWatchPartsCycle({ cycleFocus: "bathAndBasket" })
        .keyConcern,
    ).toContain("tank bottom");
  });

  it("covers cleaning and rinsing", () => {
    expect(
      lookupUltrasonicWatchPartsCycle({ cycleFocus: "cleaning" }).keyConcern,
    ).toContain("approved");
    expect(
      lookupUltrasonicWatchPartsCycle({ cycleFocus: "rinse" }).keyConcern,
    ).toContain("fresh compatible fluid");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runUltrasonicCycle({ cycleFocus: "seconds" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "cycleFocus" }] },
      ok: false,
    });
  });
});
