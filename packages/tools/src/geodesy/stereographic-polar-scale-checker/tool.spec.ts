import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { pointScale: 1, atPole: true } };
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
    label: "latitude cannot exceed pole",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: 91,
      pole: "north",
      poleScale: 1,
    },
    reject: true,
  },
  {
    label: "negative flattening",
    input: {
      semiMajorMeters: 10,
      flattening: -0.001,
      latitudeDegrees: 90,
      pole: "north",
      poleScale: 1,
    },
    reject: true,
  },
  {
    label: "unsupported flattening",
    input: {
      semiMajorMeters: 10,
      flattening: 0.03,
      latitudeDegrees: 90,
      pole: "north",
      poleScale: 1,
    },
    reject: true,
  },
  {
    label: "PROJ ellipsoidal polar stereographic scale 0",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 0,
      pole: "north",
      poleScale: 0.994,
    },
    expected: { pointScale: 1.9813494909439506 },
    tolerance: 1e-8,
  },
  {
    label: "PROJ ellipsoidal polar stereographic scale 30",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 30,
      pole: "north",
      poleScale: 0.994,
    },
    expected: { pointScale: 1.3242213497486504 },
    tolerance: 1e-8,
  },
  {
    label: "PROJ ellipsoidal polar stereographic scale 80",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 80,
      pole: "north",
      poleScale: 0.994,
    },
    expected: { pointScale: 1.0016075617045452 },
    tolerance: 1e-8,
  },
  {
    label: "PROJ ellipsoidal polar stereographic scale 90",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 90,
      pole: "north",
      poleScale: 0.994,
    },
    expected: { pointScale: 0.994 },
    tolerance: 1e-8,
  },
  {
    label: "same hemisphere required",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: -30,
      pole: "north",
      poleScale: 1,
    },
    reject: true,
  },
  {
    label: "explicit pole choice",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: 90,
      pole: "other",
      poleScale: 1,
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
