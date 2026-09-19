import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { ecefMeters: [10, 0, 0] } };
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
    label: "PROJ geodetic to ECEF (-89.9, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -89.9,
      longitudeDegrees: -170,
      ellipsoidalHeightMeters: -100,
    },
    expected: {
      ecefMeters: [-10999.5321247561, -1939.514288764009, -6356642.567261622],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (-89.9, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -89.9,
      longitudeDegrees: 40,
      ellipsoidalHeightMeters: 1234,
    },
    expected: {
      ecefMeters: [8557.900662194019, 7180.931289298802, -6357976.565229825],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (-89.9, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -89.9,
      longitudeDegrees: 179,
      ellipsoidalHeightMeters: 35786000,
    },
    expected: {
      ecefMeters: [-73616.49921531648, 1284.9807735914226, -42142688.06192823],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (-75, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -75,
      longitudeDegrees: -170,
      ellipsoidalHeightMeters: -100,
    },
    expected: {
      ecefMeters: [
        -1630779.6654893255, -287550.45461649314, -6138669.089775613,
      ],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (-75, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -75,
      longitudeDegrees: 40,
      ellipsoidalHeightMeters: 1234,
    },
    expected: {
      ecefMeters: [1268785.8790135582, 1064637.7631232175, -6139957.634827882],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (-75, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -75,
      longitudeDegrees: 179,
      ellipsoidalHeightMeters: 35786000,
    },
    expected: {
      ecefMeters: [-10916398.426784443, 190546.44332181395, -40705387.30193884],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (-30, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -30,
      longitudeDegrees: -170,
      ellipsoidalHeightMeters: -100,
    },
    expected: {
      ecefMeters: [-5444184.712163602, -959956.6527149911, -3170323.735383637],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (-30, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -30,
      longitudeDegrees: 40,
      ellipsoidalHeightMeters: 1234,
    },
    expected: {
      ecefMeters: [4235708.931477914, 3554181.8021774283, -3170990.735383637],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (-30, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: -30,
      longitudeDegrees: 179,
      ellipsoidalHeightMeters: 35786000,
    },
    expected: {
      ecefMeters: [-36514279.590338066, 637359.1210564384, -21063373.735383634],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (0, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 0,
      longitudeDegrees: -170,
      ellipsoidalHeightMeters: -100,
    },
    expected: { ecefMeters: [-6281140.286598724, -1107534.502142255, 0.0] },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (0, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 0,
      longitudeDegrees: 40,
      ellipsoidalHeightMeters: 1234,
    },
    expected: { ecefMeters: [4886881.705144358, 4100580.6363936276, 0.0] },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (0, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 0,
      longitudeDegrees: 179,
      ellipsoidalHeightMeters: 35786000,
    },
    expected: { ecefMeters: [-42157715.197708316, 735865.6560013008, 0.0] },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (35, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 35,
      longitudeDegrees: -170,
      ellipsoidalHeightMeters: -100,
    },
    expected: {
      ecefMeters: [-5150884.233064047, -908239.8647950203, 3637809.55173446],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (35, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 35,
      longitudeDegrees: 40,
      ellipsoidalHeightMeters: 1234,
    },
    expected: {
      ecefMeters: [4007513.75955539, 3362703.3175808024, 3638574.7027005525],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (35, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 35,
      longitudeDegrees: 179,
      ellipsoidalHeightMeters: 35786000,
    },
    expected: {
      ecefMeters: [-34539340.58693675, 602886.4325227994, 24163873.26063663],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (80, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 80,
      longitudeDegrees: -170,
      ellipsoidalHeightMeters: -100,
    },
    expected: {
      ecefMeters: [-1094266.6786413426, -192948.73953470797, 6259444.480253389],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (80, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 80,
      longitudeDegrees: 40,
      ellipsoidalHeightMeters: 1234,
    },
    expected: {
      ecefMeters: [851365.8240944317, 714380.7489945786, 6260758.213795908],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (80, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 80,
      longitudeDegrees: 179,
      ellipsoidalHeightMeters: 35786000,
    },
    expected: {
      ecefMeters: [-7324222.87225551, 127844.78578395567, 41501873.21032357],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (89.9, -170, -100)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 89.9,
      longitudeDegrees: -170,
      ellipsoidalHeightMeters: -100,
    },
    expected: {
      ecefMeters: [-10999.5321247561, -1939.514288764009, 6356642.567261622],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (89.9, 40, 1234)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 89.9,
      longitudeDegrees: 40,
      ellipsoidalHeightMeters: 1234,
    },
    expected: {
      ecefMeters: [8557.900662194019, 7180.931289298802, 6357976.565229825],
    },
    tolerance: 2e-7,
  },
  {
    label: "PROJ geodetic to ECEF (89.9, 179, 35786000)",
    input: {
      semiMajorMeters: 6378137,
      flattening: 0.0033528106647474805,
      latitudeDegrees: 89.9,
      longitudeDegrees: 179,
      ellipsoidalHeightMeters: 35786000,
    },
    expected: {
      ecefMeters: [-73616.49921531648, 1284.9807735914226, 42142688.06192823],
    },
    tolerance: 2e-7,
  },
  {
    label: "latitude cannot exceed pole",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: 91,
      longitudeDegrees: 0,
      ellipsoidalHeightMeters: 0,
    },
    reject: true,
  },
  {
    label: "negative flattening",
    input: {
      semiMajorMeters: 10,
      flattening: -0.001,
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      ellipsoidalHeightMeters: 0,
    },
    reject: true,
  },
  {
    label: "unsupported flattening",
    input: {
      semiMajorMeters: 10,
      flattening: 0.03,
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      ellipsoidalHeightMeters: 0,
    },
    reject: true,
  },
  {
    label: "longitude must be canonical",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: 0,
      longitudeDegrees: 181,
      ellipsoidalHeightMeters: 0,
    },
    reject: true,
  },
  {
    label: "deep interior height",
    input: {
      semiMajorMeters: 10,
      flattening: 0,
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      ellipsoidalHeightMeters: -10,
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
