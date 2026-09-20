import { expect, it } from "vitest";
import tool, {
  calculateCubicHermiteCurveBank,
  cubicHermiteCurveBankExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(tool, calculateCubicHermiteCurveBank, example);
it("matches a hand-known quarter sample and preserves large endpoint precision", () => {
  const result = calculateCubicHermiteCurveBank({
    ...example.input,
    count: 1,
    samplesPerCurve: 5,
    p0Range: { minimum: 2, maximum: 2 },
    p1Range: { minimum: 8, maximum: 8 },
    m0Range: { minimum: 5, maximum: 5 },
    m1Range: { minimum: -3, maximum: -3 },
  });
  if (!result.ok) throw new Error("expected known Hermite curve");
  expect(result.output.curves[0].samples[1]).toEqual({
    t: 0.25,
    value: 3.78125,
    coreValue: 3.78125,
  });
  const large = calculateCubicHermiteCurveBank({
    ...example.input,
    count: 1,
    p0Range: { minimum: 1234567890123, maximum: 1234567890123 },
  });
  if (!large.ok) throw new Error("expected large endpoint");
  expect(large.output.curves[0].samples[0]).toEqual({
    t: 0,
    value: 1234567890123,
    coreValue: 1234567890120,
  });
});
it("agrees with independent Bezier conversion and de Casteljau evaluation", () => {
  const result = calculateCubicHermiteCurveBank({
    ...example.input,
    count: 12,
    samplesPerCurve: 17,
    seed: 21,
  });
  if (!result.ok) throw new Error("expected curve bank");
  for (const curve of result.output.curves) {
    expect(curve.samples[0].value).toBe(curve.p0);
    expect(curve.samples.at(-1)?.value).toBe(curve.p1);
    for (const sample of curve.samples) {
      let controls = [
        curve.p0,
        curve.p0 + curve.m0 / 3,
        curve.p1 - curve.m1 / 3,
        curve.p1,
      ];
      while (controls.length > 1)
        controls = controls
          .slice(1)
          .map((right, i) => controls[i] * (1 - sample.t) + right * sample.t);
      expect(sample.value).toBeCloseTo(controls[0], 12);
      // The inherited core rounds to 12 significant digits, so scale the bound.
      expect(Math.abs(sample.coreValue - sample.value)).toBeLessThanOrEqual(
        6e-12 * Math.max(1, Math.abs(sample.value)),
      );
    }
  }
});
it("does not promise monotonicity and enforces independent work/range bounds", () => {
  const result = calculateCubicHermiteCurveBank({
    ...example.input,
    count: 1,
    samplesPerCurve: 5,
    p0Range: { minimum: 0, maximum: 0 },
    p1Range: { minimum: 1, maximum: 1 },
    m0Range: { minimum: 40, maximum: 40 },
    m1Range: { minimum: 0, maximum: 0 },
  });
  if (!result.ok) throw new Error("expected overshooting curve");
  expect(result.output.curves[0].samples[1].value).toBe(5.78125);
  expect(
    tool.execute({ ...example.input, count: 32, samplesPerCurve: 65 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "resource_limit", field: "samplesPerCurve" }] },
  });
  expect(
    tool.execute({ ...example.input, m0Range: { minimum: 3, maximum: 2 } }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_integer_range", field: "m0Range" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      p0Range: {
        minimum: -Number.MAX_SAFE_INTEGER,
        maximum: Number.MAX_SAFE_INTEGER,
      },
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_integer_range", field: "p0Range" }] },
  });
});
