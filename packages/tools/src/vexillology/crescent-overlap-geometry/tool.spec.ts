import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const close = (a: unknown, e: unknown): void => {
  if (typeof e === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - e)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(e)) * 1e-8,
    );
  } else if (Array.isArray(e)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(e.length);
    e.forEach((v, i) => close((a as unknown[])[i], v));
  } else if (e && typeof e === "object") {
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(e).sort());
    for (const [k, v] of Object.entries(e))
      close((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(e);
};
describe(tool.id, () => {
  it("matches independent canonical observations and reference entries", () => {
    close(calculate(example.input), example.output);
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, example.output);
  });
  it("publishes valid portable contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing, unknown and inherited root fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects wrong types and nonfinite inputs", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and does not rewrite caller evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    expect(calculate(input)).toEqual(calculate(input));
    expect(JSON.stringify(input)).toBe(before);
  });
  it("bounds arrays and rejects sparse or inherited slots", () => {
    for (const [k, v] of Object.entries(example.input))
      if (Array.isArray(v)) {
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
        const tooBig =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: tooBig })).toMatchObject({
          ok: false,
        });
      }
  });
  it("rejects invalid domain assumptions", () => {
    const input = { ...example.input, outerRadius: 0 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("retains independent boundary values or unknown evidence", () => {
    const input = { ...example.input, centerSeparation: 0 };
    close(calculate(input), {
      result: {
        circularOverlapArea: 314.1592653589793,
        remainingCrescentArea: 0,
      },
    });
    const r = tool.execute(input);
    expect(r.ok).toBe(true);
    if (r.ok)
      close(r.output, {
        result: {
          circularOverlapArea: 314.1592653589793,
          remainingCrescentArea: 0,
        },
      });
  });
});
describe("disc subtraction boundaries", () => {
  it("handles disjoint, tangent and fully enclosing cutouts", () => {
    for (const centerSeparation of [20, 30]) {
      const r = calculate({
        outerRadius: 10,
        cutoutRadius: 10,
        centerSeparation,
      }).result;
      expect(r.circularOverlapArea).toBe(0);
      expect(r.remainingCrescentArea).toBeCloseTo(Math.PI * 100, 10);
    }
    expect(
      calculate({ outerRadius: 10, cutoutRadius: 20, centerSeparation: 5 })
        .result.remainingCrescentArea,
    ).toBeCloseTo(0, 10);
  });
  it("subtracts a contained smaller cutout from actual outer area", () => {
    const r = calculate({
      outerRadius: 10,
      cutoutRadius: 5,
      centerSeparation: 0,
    }).result;
    expect(r.circularOverlapArea).toBeCloseTo(25 * Math.PI, 10);
    expect(r.remainingCrescentArea).toBeCloseTo(75 * Math.PI, 10);
  });
  it("rejects nonfinite area rather than returning overflow", () => {
    expect(() =>
      calculate({
        outerRadius: 1e300,
        cutoutRadius: 1e300,
        centerSeparation: 1e300,
      }),
    ).toThrow();
  });
});
