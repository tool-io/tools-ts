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
    latitudeDegrees: 0,
    longitudeDegrees: 90,
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
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      initialBearingDegrees: 90,
      distanceMeters: 15.707963267948966,
    },
    reject: true,
  },
  {
    label: "GeographicLib direct (0, 179, 90, 1000000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 0,
      longitudeDegrees: 179,
      initialBearingDegrees: 90,
      distanceMeters: 1000000,
    },
    expected: {
      latitudeDegrees: 0.0,
      longitudeDegrees: -172.01684715880478,
      finalBearingDegrees: 90.0,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "GeographicLib direct (45, 20, 123, 5000000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 45,
      longitudeDegrees: 20,
      initialBearingDegrees: 123,
      distanceMeters: 5000000,
    },
    expected: {
      latitudeDegrees: 13.105077356784234,
      longitudeDegrees: 57.43280200263457,
      finalBearingDegrees: 142.42465162563775,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "GeographicLib direct (-33, -70, 359, 400000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -33,
      longitudeDegrees: -70,
      initialBearingDegrees: 359,
      distanceMeters: 400000,
    },
    expected: {
      latitudeDegrees: -29.392797914264204,
      longitudeDegrees: -70.07187082871525,
      finalBearingDegrees: 359.03724568260594,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "GeographicLib direct (-80, 170, 20, 1000000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -80,
      longitudeDegrees: 170,
      initialBearingDegrees: 20,
      distanceMeters: 1000000,
    },
    expected: {
      latitudeDegrees: -71.33106907235779,
      longitudeDegrees: 179.57503097197133,
      finalBearingDegrees: 10.695243043152733,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "GeographicLib direct (90, 10, 0, 1000000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 90,
      longitudeDegrees: 10,
      initialBearingDegrees: 0,
      distanceMeters: 1000000,
    },
    expected: {
      latitudeDegrees: 81.04623281595062,
      longitudeDegrees: -170.0,
      finalBearingDegrees: 180.0,
      converged: true,
    },
    tolerance: 2e-7,
  },
  {
    label: "zero distance retains start and has no end bearing",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      initialBearingDegrees: 90,
      distanceMeters: 0,
    },
    expected: {
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      finalBearingDegrees: null,
      iterations: 0,
      converged: true,
    },
    tolerance: 1e-8,
  },
  {
    label: "negative path length",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      initialBearingDegrees: 90,
      distanceMeters: -1,
    },
    reject: true,
  },
  {
    label: "oversized path length",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      initialBearingDegrees: 90,
      distanceMeters: 100,
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
