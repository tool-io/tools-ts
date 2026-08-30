import { describe, expect, it } from "vitest";
import {
  calculateRandomShellGlobToken,
  randomShellGlobTokenExample,
  randomShellGlobTokenValueCount,
  runRandomShellGlobToken,
} from "./tool.js";

describe("Random Shell Glob Token Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomShellGlobTokenExample))).toEqual(randomShellGlobTokenExample);
    expect(runRandomShellGlobToken(randomShellGlobTokenExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "*" },
    });
    expect(runRandomShellGlobToken(randomShellGlobTokenExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "\\" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomShellGlobTokenValueCount },
        (_, index) =>
          calculateRandomShellGlobToken(
            () => (index + 0.5) / randomShellGlobTokenValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomShellGlobTokenValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomShellGlobToken({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomShellGlobToken({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
