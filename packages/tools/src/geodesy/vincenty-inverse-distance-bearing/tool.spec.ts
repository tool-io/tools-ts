import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = {
  result: {
    converged: true,
    iterations: 1,
    distanceMeters: 15.707963267948966,
    initialBearingDegrees: 90,
    finalBearingDegrees: 90,
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
    label: "invalid ellipsoid",
    input: {
      semiMajorMeters: 10,
      flattening: -0.001,
      startLatitudeDegrees: 0,
      startLongitudeDegrees: 0,
      endLatitudeDegrees: 0,
      endLongitudeDegrees: 90,
    },
    reject: true,
  },
  {
    label: "GeographicLib inverse (0, 179, 90, 1000000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      startLongitudeDegrees: 179,
      endLatitudeDegrees: 0.0,
      endLongitudeDegrees: -172.01684715880478,
    },
    expected: {
      distanceMeters: 1000000.0000000006,
      initialBearingDegrees: 90.0,
      finalBearingDegrees: 90.0,
      converged: true,
    },
    tolerance: 0.001,
  },
  {
    label: "GeographicLib inverse (45, 20, 123, 5000000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 45,
      startLongitudeDegrees: 20,
      endLatitudeDegrees: 13.105077356784234,
      endLongitudeDegrees: 57.43280200263457,
    },
    expected: {
      distanceMeters: 5000000.0,
      initialBearingDegrees: 123.0,
      finalBearingDegrees: 142.42465162563775,
      converged: true,
    },
    tolerance: 0.001,
  },
  {
    label: "GeographicLib inverse (-33, -70, 359, 400000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: -33,
      startLongitudeDegrees: -70,
      endLatitudeDegrees: -29.392797914264204,
      endLongitudeDegrees: -70.07187082871525,
    },
    expected: {
      distanceMeters: 399999.9999999996,
      initialBearingDegrees: 359.00000000000006,
      finalBearingDegrees: 359.037245682606,
      converged: true,
    },
    tolerance: 0.001,
  },
  {
    label: "GeographicLib inverse (-80, 170, 20, 1000000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: -80,
      startLongitudeDegrees: 170,
      endLatitudeDegrees: -71.33106907235779,
      endLongitudeDegrees: 179.57503097197133,
    },
    expected: {
      distanceMeters: 999999.9999999986,
      initialBearingDegrees: 19.999999999999982,
      finalBearingDegrees: 10.695243043152729,
      converged: true,
    },
    tolerance: 0.001,
  },
  {
    label: "GeographicLib inverse (90, 10, 0, 1000000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 90,
      startLongitudeDegrees: 10,
      endLatitudeDegrees: 81.04623281595062,
      endLongitudeDegrees: -170.0,
    },
    expected: {
      distanceMeters: 1000000.0000000003,
      initialBearingDegrees: 0.0,
      finalBearingDegrees: 180.0,
      converged: true,
    },
    tolerance: 0.001,
  },
  {
    label: "coincident point has no azimuth",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      startLatitudeDegrees: 0,
      startLongitudeDegrees: 0,
      endLatitudeDegrees: 0,
      endLongitudeDegrees: 0,
    },
    expected: {
      distanceMeters: 0,
      initialBearingDegrees: null,
      finalBearingDegrees: null,
      converged: true,
      iterations: 0,
    },
    tolerance: 1e-8,
  },
  {
    label: "near-antipodal WGS84 failure is explicit",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      startLatitudeDegrees: 0,
      startLongitudeDegrees: 0,
      endLatitudeDegrees: 0.5,
      endLongitudeDegrees: 179.7,
    },
    expected: {
      converged: false,
      distanceMeters: null,
      initialBearingDegrees: null,
      iterations: 200,
    },
    tolerance: 1e-8,
  },
  {
    label: "exact spherical antipodes have no unique azimuth",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      startLatitudeDegrees: 0,
      startLongitudeDegrees: 0,
      endLatitudeDegrees: 0,
      endLongitudeDegrees: 180,
    },
    expected: {
      converged: false,
      distanceMeters: null,
      initialBearingDegrees: null,
      iterations: 0,
    },
    tolerance: 1e-8,
  },
  {
    label: "end latitude is invalid",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      startLatitudeDegrees: 0,
      startLongitudeDegrees: 0,
      endLatitudeDegrees: 91,
      endLongitudeDegrees: 90,
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
