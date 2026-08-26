import { describe, expect, it } from "vitest";
import {
  trismegistosNumberCheckExample,
  runTrismegistosNumberCheck,
} from "./tool.js";

describe("trismegistos-number-check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTrismegistosNumberCheck(trismegistosNumberCheckExample.input),
    ).toEqual({
      ok: true,
      output: trismegistosNumberCheckExample.output,
    });
  });

  it("accepts bare numbers and preserves leading zeros in the normalized form", () => {
    expect(runTrismegistosNumberCheck({ identifier: "004321" })).toEqual({
      ok: true,
      output: { normalizedId: "TM 004321", numericId: 4321 },
    });
  });
  it("rejects letters inside the number", () => {
    expect(runTrismegistosNumberCheck({ identifier: "TM 12a45" }).ok).toBe(
      false,
    );
    expect(runTrismegistosNumberCheck({ identifier: "TM 0" }).ok).toBe(false);
  });
});
