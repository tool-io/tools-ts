import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
declare const structuredClone: <T>(value: T) => T;
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("ignores noncapturable ep but preserves legal ep position differences", () => {
    const unused = "4k3/8/8/3p4/8/8/8/4K3 w - d6 0 1",
      legal = "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1";
    expect(
      calculate({
        observedPositionFens: [unused, unused.replace("d6", "-"), unused],
      }).finalPositionOccurrenceCount,
    ).toBe(3);
    expect(
      calculate({
        observedPositionFens: [legal, legal.replace("d6", "-"), legal],
      }).finalPositionOccurrenceCount,
    ).toBe(2);
  });
  it("ignores pseudo-legal ep that exposes the king", () => {
    const p = "4k3/8/8/r4pPK/8/8/8/8 w - f6 0 1";
    expect(
      calculate({ observedPositionFens: [p, p.replace("f6", "-"), p] })
        .threefoldClaimCandidate,
    ).toBe(true);
  });
  it("computes independently specified canonical results", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects mistyped and nonfinite fields", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and does not mutate caller evidence", () => {
    const input = structuredClone(example.input),
      before = structuredClone(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(input).toEqual(before);
  });
  it("rejects invalid domains and resource requests", () => {
    const input = { ...example.input, observedPositionFens: [] };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = {
      ...example.input,
      observedPositionFens: ["4k3/8/8/8/8/8/8/4K3 w - - 0 1"],
    };
    close(calculate(input), {
      finalPositionOccurrenceCount: 1,
      threefoldClaimCandidate: false,
      fivefoldAutomaticDrawCandidate: false,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        finalPositionOccurrenceCount: 1,
        threefoldClaimCandidate: false,
        fivefoldAutomaticDrawCandidate: false,
      });
  });
});
