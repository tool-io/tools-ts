import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = {
  result: {
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    ellipsoidalHeightMeters: 0,
    iterations: 1,
    residualMeters: 0,
    converged: true,
  },
};
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
    label: "PROJ Bowring initialization with radius (-89.9, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -89.89932604110604,
      geocentricRadiusMeters: 6356652.379935926,
    },
    expected: {
      latitudeDegrees: -89.9,
      ellipsoidalHeightMeters: -100,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (-89.9, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -89.89932618251264,
      geocentricRadiusMeters: 6357986.379935834,
    },
    expected: {
      latitudeDegrees: -89.9,
      ellipsoidalHeightMeters: 1234,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (-89.9, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -89.89989834260543,
      geocentricRadiusMeters: 42142752.3795625,
    },
    expected: {
      latitudeDegrees: -89.9,
      ellipsoidalHeightMeters: 35786000,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (-75, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -74.90350595637224,
      geocentricRadiusMeters: 6358096.080989196,
    },
    expected: {
      latitudeDegrees: -75,
      ellipsoidalHeightMeters: -100,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (-75, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -74.90352619765042,
      geocentricRadiusMeters: 6359430.0790977655,
    },
    expected: {
      latitudeDegrees: -75,
      ellipsoidalHeightMeters: 1234,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (-75, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -74.98544240285216,
      geocentricRadiusMeters: 42144188.424505316,
    },
    expected: {
      latitudeDegrees: -75,
      ellipsoidalHeightMeters: 35786000,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (-30, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -29.833633199266526,
      geocentricRadiusMeters: 6372724.420715563,
    },
    expected: {
      latitudeDegrees: -30,
      ellipsoidalHeightMeters: -100,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (-30, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -29.833668017428806,
      geocentricRadiusMeters: 6374058.415093152,
    },
    expected: {
      latitudeDegrees: -30,
      ellipsoidalHeightMeters: 1234,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (-30, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: -29.97485202905656,
      geocentricRadiusMeters: 42158801.616827555,
    },
    expected: {
      latitudeDegrees: -30,
      ellipsoidalHeightMeters: 35786000,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (0, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 0.0,
      geocentricRadiusMeters: 6378037.0,
    },
    expected: {
      latitudeDegrees: 0,
      ellipsoidalHeightMeters: -100,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (0, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 0.0,
      geocentricRadiusMeters: 6379371.0,
    },
    expected: {
      latitudeDegrees: 0,
      ellipsoidalHeightMeters: 1234,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (0, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 0.0,
      geocentricRadiusMeters: 42164137.0,
    },
    expected: {
      latitudeDegrees: 0,
      ellipsoidalHeightMeters: 35786000,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (35, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 34.8193858674755,
      geocentricRadiusMeters: 6371041.231158463,
    },
    expected: {
      latitudeDegrees: 35,
      ellipsoidalHeightMeters: -100,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (35, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 34.81942367737296,
      geocentricRadiusMeters: 6372375.224531833,
    },
    expected: {
      latitudeDegrees: 35,
      ellipsoidalHeightMeters: 1234,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (35, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 34.97270453064762,
      geocentricRadiusMeters: 42157114.36029565,
    },
    expected: {
      latitudeDegrees: 35,
      ellipsoidalHeightMeters: 35786000,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (80, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 79.9339777714564,
      geocentricRadiusMeters: 6357302.413873939,
    },
    expected: {
      latitudeDegrees: 80,
      ellipsoidalHeightMeters: -100,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (80, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 79.93399162248163,
      geocentricRadiusMeters: 6358636.412988477,
    },
    expected: {
      latitudeDegrees: 80,
      ellipsoidalHeightMeters: 1234,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (80, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 79.99004059487912,
      geocentricRadiusMeters: 42143398.82991756,
    },
    expected: {
      latitudeDegrees: 80,
      ellipsoidalHeightMeters: 35786000,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (89.9, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 89.89932604110604,
      geocentricRadiusMeters: 6356652.379935926,
    },
    expected: {
      latitudeDegrees: 89.9,
      ellipsoidalHeightMeters: -100,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (89.9, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 89.89932618251264,
      geocentricRadiusMeters: 6357986.379935834,
    },
    expected: {
      latitudeDegrees: 89.9,
      ellipsoidalHeightMeters: 1234,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ Bowring initialization with radius (89.9, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      geocentricLatitudeDegrees: 89.89989834260543,
      geocentricRadiusMeters: 42142752.3795625,
    },
    expected: {
      latitudeDegrees: 89.9,
      ellipsoidalHeightMeters: 35786000,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "invalid ellipsoid",
    input: {
      semiMajorMeters: 10,
      flattening: -0.001,
      geocentricLatitudeDegrees: 0,
      geocentricRadiusMeters: 10,
    },
    reject: true,
  },
  {
    label: "deep interior ambiguous radius",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      geocentricLatitudeDegrees: 0,
      geocentricRadiusMeters: 1,
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
