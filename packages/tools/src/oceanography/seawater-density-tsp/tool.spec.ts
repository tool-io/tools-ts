import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
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
  it("matches an independent UNESCO high-pressure reference", () => {
    // UNESCO Technical Paper 44, p22; reproduced independently at
    // https://pyoceans.github.io/python-seawater/eos80.html#seawater.eos80.dens
    const cases = [
      [0, 0, 0, 999.842594],
      [0, 0, 10000, 1045.33710972],
      [30, 0, 0, 995.65113374],
      [30, 0, 10000, 1036.03148891],
      [0, 35, 0, 1028.10633141],
      [0, 35, 10000, 1070.95838408],
      [30, 35, 0, 1021.72863949],
      [30, 35, 10000, 1060.55058771],
    ];
    for (const [
      temperatureIpts68C,
      practicalSalinity,
      pressureDbar,
      expected,
    ] of cases)
      expect(
        calculate({ temperatureIpts68C, practicalSalinity, pressureDbar })
          .densityKgPerM3,
      ).toBeCloseTo(expected, 7);
  });
  it("refuses unsupported state conventions and extrapolation", () => {
    expect(() =>
      calculate({ ...example.input, temperatureIpts68C: -1 }),
    ).toThrow();
    expect(() =>
      calculate({ ...example.input, pressureDbar: 10001 }),
    ).toThrow();
  });
  it("computes independent canonical results", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and portable examples", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects malformed and nonfinite fields", () => {
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
  it("rejects invalid domain parameters", () => {
    const input = { ...example.input, practicalSalinity: 50 };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles an independent boundary scenario", () => {
    const input = { ...example.input, practicalSalinity: 35 };
    close(calculate(input), { densityKgPerM3: 1028.1063314148107 });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, { densityKgPerM3: 1028.1063314148107 });
  });
});
