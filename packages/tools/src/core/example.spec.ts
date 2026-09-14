import { describe, expect, it } from "vitest";
import { exampleOutputsMatch } from "./example.js";

describe("exampleOutputsMatch", () => {
  it("accepts bounded floating-point variation recursively", () => {
    expect(
      exampleOutputsMatch(
        { values: [0.30000000000000004, 3.552713678800501e-15] },
        { values: [0.3, 0] },
      ),
    ).toBe(true);
  });

  it("rejects material numeric and structural differences", () => {
    expect(exampleOutputsMatch({ value: 1e-9 }, { value: 0 })).toBe(false);
    expect(
      exampleOutputsMatch({ value: 1_000_000_001 }, { value: 1_000_000_000 }),
    ).toBe(false);
    expect(exampleOutputsMatch({ value: 1 }, { value: 1, extra: true })).toBe(
      false,
    );
    expect(exampleOutputsMatch([1, 2], [1, 3])).toBe(false);
  });

  it("keeps nonnumeric values exact", () => {
    expect(exampleOutputsMatch({ status: "ok" }, { status: "okay" })).toBe(
      false,
    );
    expect(exampleOutputsMatch(true, true)).toBe(true);
  });
});
