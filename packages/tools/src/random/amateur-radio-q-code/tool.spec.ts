import { describe, expect, it } from "vitest";
import {
  calculateRandomAmateurRadioQCode,
  randomAmateurRadioQCodeExample,
  randomAmateurRadioQCodeValueCount,
  runRandomAmateurRadioQCode,
} from "./tool.js";

describe("Random Amateur Radio Q Code Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomAmateurRadioQCodeExample))).toEqual(randomAmateurRadioQCodeExample);
    expect(runRandomAmateurRadioQCode(randomAmateurRadioQCodeExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "QRA" },
    });
    expect(runRandomAmateurRadioQCode(randomAmateurRadioQCodeExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "QTH" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomAmateurRadioQCodeValueCount },
        (_, index) =>
          calculateRandomAmateurRadioQCode(
            () => (index + 0.5) / randomAmateurRadioQCodeValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAmateurRadioQCodeValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomAmateurRadioQCode({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomAmateurRadioQCode({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
