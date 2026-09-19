import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { signedDistanceMeters: 5.235987755982989 } };
export const close = (a: unknown, b: unknown): void => {
  if (typeof b === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - b)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(b)) * 1e-9,
    );
  } else if (Array.isArray(b)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(b.length);
    b.forEach((v, j) => close((a as unknown[])[j], v));
  } else if (b && typeof b === "object") {
    expect(a !== null && typeof a === "object").toBe(true);
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(b).sort());
    for (const [k, v] of Object.entries(b))
      close((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(b);
};
describe(tool.id, () => {
  it("matches an independent canonical value", () =>
    close(calculate(example.input), expected));
  it("executes the same public calculation", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes valid contract and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own explicit fields and rejects extras", () => {
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects nulls and wrong types", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      expect(
        tool.execute({
          ...example.input,
          [k]: typeof v === "string" ? 1 : "bad",
        }),
      ).toMatchObject({ ok: false });
    }
  });
  it("rejects nonfinite numbers and sparse arrays", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "number")
        for (const bad of [NaN, Infinity, -Infinity])
          expect(() =>
            calculate({ ...example.input, [k]: bad } as Input),
          ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
    }
  });
  it("bounds strings and dense lists", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "string")
        expect(() =>
          calculate({ ...example.input, [k]: "x".repeat(8193) } as Input),
        ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(129).fill(v[0]) } as Input),
        ).toThrow();
    }
  });
  it("does not mutate evidence or consult ambient randomness", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      s = JSON.stringify(x);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(s);
    close(example.output, expected);
  });
});

// Independent Python/PROJ/GeographicLib fixtures and physical boundary regressions.
const physicalCases = [
  {
    label: "GeographicLib meridian arc to -89.9",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      endLatitudeDegrees: -89.9,
    },
    expected: { signedDistanceMeters: -9990796.331471464 },
    tolerance: 1e-7,
  },
  {
    label: "GeographicLib meridian arc to -75",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      endLatitudeDegrees: -75,
    },
    expected: { signedDistanceMeters: -8326937.587280348 },
    tolerance: 1e-7,
  },
  {
    label: "GeographicLib meridian arc to -30",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      endLatitudeDegrees: -30,
    },
    expected: { signedDistanceMeters: -3320113.397940383 },
    tolerance: 1e-7,
  },
  {
    label: "GeographicLib meridian arc to 0",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      endLatitudeDegrees: 0,
    },
    expected: { signedDistanceMeters: 0.0 },
    tolerance: 1e-7,
  },
  {
    label: "GeographicLib meridian arc to 35",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      endLatitudeDegrees: 35,
    },
    expected: { signedDistanceMeters: 3874592.9016949385 },
    tolerance: 1e-7,
  },
  {
    label: "GeographicLib meridian arc to 80",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      endLatitudeDegrees: 80,
    },
    expected: { signedDistanceMeters: 8885139.871936874 },
    tolerance: 1e-7,
  },
  {
    label: "GeographicLib meridian arc to 89.9",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      endLatitudeDegrees: 89.9,
    },
    expected: { signedDistanceMeters: 9990796.331471464 },
    tolerance: 1e-7,
  },
  {
    label: "invalid ellipsoid",
    input: {
      semiMajorMeters: 10,
      flattening: -0.001,
      startLatitudeDegrees: 0,
      endLatitudeDegrees: 30,
    },
    reject: true,
  },
] as const;
it.each(physicalCases)("$label", (fixture) => {
  const input = fixture.input as unknown as Input;
  if ("reject" in fixture) {
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
    return;
  }
  const output = calculate(input).result;
  const compare = (actual: unknown, wanted: unknown): void => {
    if (typeof wanted === "number") {
      expect(typeof actual).toBe("number");
      expect(Math.abs((actual as number) - wanted)).toBeLessThanOrEqual(
        fixture.tolerance,
      );
    } else if (Array.isArray(wanted)) {
      expect(Array.isArray(actual)).toBe(true);
      expect((actual as unknown[]).length).toBe(wanted.length);
      wanted.forEach((v, j) => compare((actual as unknown[])[j], v));
    } else if (wanted !== null && typeof wanted === "object") {
      for (const [k, v] of Object.entries(wanted))
        compare((actual as Record<string, unknown>)[k], v);
    } else expect(actual).toEqual(wanted);
  };
  compare(output, fixture.expected);
  const publicRun = tool.execute(input);
  expect(publicRun.ok).toBe(true);
  if (publicRun.ok) compare(publicRun.output.result, fixture.expected);
});
