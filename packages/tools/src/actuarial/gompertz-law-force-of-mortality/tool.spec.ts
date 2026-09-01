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
describe("conditional actuarial model boundaries", () => {
  it("matches direct force at age0and doubles after the stated interval", () => {
    const zero = calculate({ ...example.input, ageYears: 0 }).result;
    const one = calculate({ ...example.input, ageYears: 1 }).result;
    expect(zero.conditionalForcePerYear).toBeCloseTo(0.001, 14);
    expect(one.conditionalForcePerYear).toBeCloseTo(0.002, 14);
    expect(one.forceDoublingAgeIntervalYears).toBe(1);
  });
  it("uses integrated hazard rather than equating hazard with death probability", () => {
    const r = calculate(example.input).result;
    expect(r.conditionalIntegratedNextYearHazard).toBeCloseTo(
      0.008 / Math.log(2),
      14,
    );
    expect(r.conditionalNextYearSurvival).toBeCloseTo(
      Math.exp(-0.008 / Math.log(2)),
      14,
    );
    expect(1 - (r.conditionalNextYearSurvival as number)).not.toBe(0.008);
  });
  it("uses stable small-growth integration and rejects overflow", () => {
    const r = calculate({
      ...example.input,
      callerCalibratedAnnualGrowthFactor: 1 + 1e-10,
      ageYears: 0,
    }).result;
    expect(r.conditionalIntegratedNextYearHazard).toBeCloseTo(0.001, 10);
    expect(() =>
      calculate({
        ...example.input,
        callerCalibratedAnnualGrowthFactor: 1e300,
        ageYears: 150,
      }),
    ).toThrow();
    expect(() => calculate({ ...example.input, ageYears: 151 })).toThrow();
  });
});
describe(tool.id, () => {
  it("matches independently specified values or bounded reference entries", () => {
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
  it("requires explicit own fields and rejects unknown root keys", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects type errors and nonfinite evidence", () => {
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
  it("is deterministic without rewriting caller observations", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    expect(calculate(input)).toEqual(calculate(input));
    expect(JSON.stringify(input)).toBe(before);
  });
  it("rejects sparse, inherited or oversized observation arrays", () => {
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
  it("rejects unsupported domains, keys or invalid calibration", () => {
    const input = { ...example.input, callerCalibratedAnnualGrowthFactor: 1 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("retains independent boundary values or unknown evidence", () => {
    const input = { ...example.input, ageYears: 0 };
    close(calculate(input), {
      result: {
        conditionalForcePerYear: 0.001,
        forceDoublingAgeIntervalYears: 1,
        conditionalIntegratedNextYearHazard: 0.0014426950408889636,
        conditionalNextYearSurvival: 0.9985583451433185,
      },
    });
    const r = tool.execute(input);
    expect(r.ok).toBe(true);
    if (r.ok)
      close(r.output, {
        result: {
          conditionalForcePerYear: 0.001,
          forceDoublingAgeIntervalYears: 1,
          conditionalIntegratedNextYearHazard: 0.0014426950408889636,
          conditionalNextYearSurvival: 0.9985583451433185,
        },
      });
  });
});
