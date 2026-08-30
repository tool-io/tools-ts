import { describe, expect, it } from "vitest";
import {
  calculateRandomRegularExpressionToken,
  randomRegularExpressionTokenExample,
  randomRegularExpressionTokenValueCount,
  runRandomRegularExpressionToken,
} from "./tool.js";

describe("Random Regular Expression Token Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomRegularExpressionTokenExample))).toEqual(randomRegularExpressionTokenExample);
    expect(runRandomRegularExpressionToken(randomRegularExpressionTokenExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "." },
    });
    expect(runRandomRegularExpressionToken(randomRegularExpressionTokenExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "(?!" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomRegularExpressionTokenValueCount },
        (_, index) =>
          calculateRandomRegularExpressionToken(
            () => (index + 0.5) / randomRegularExpressionTokenValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomRegularExpressionTokenValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomRegularExpressionToken({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomRegularExpressionToken({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
