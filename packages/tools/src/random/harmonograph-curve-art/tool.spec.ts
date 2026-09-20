import { expect, it } from "vitest";
import tool, { example, calculateHarmonographCurveArt } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateHarmonographCurveArt);
it("lightweight independently known decay and damping boundary", () => {
  const r = tool.execute({
    ...example.input,
    xOscillators: [
      { amplitude: 2, frequency: 0, phaseTurns: 0.25, damping: Math.log(2) },
    ],
  });
  if (!r.ok) throw new Error("Expected decay");
  expect(r.output.points[0][0]).toBe(2);
  expect(r.output.points[4][0]).toBeCloseTo(1, 14);
  expect(tool.execute({ ...example.input, duration: 0 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "duration", code: "invalid_field" }] },
  });
});
it("lightweight negative-zero oscillator metadata stays JSON-identical", () => {
  const oscillator = {
      amplitude: 2,
      frequency: -0,
      phaseTurns: -0,
      damping: -0,
    },
    r = tool.execute({ ...example.input, xOscillators: [oscillator] });
  if (!r.ok) throw new Error("Expected normalized oscillator");
  expect(r.output.xOscillator).toEqual({
    amplitude: 2,
    frequency: 0,
    phaseTurns: 0,
    damping: 0,
  });
  expect(Object.is(oscillator.frequency, -0)).toBe(true);
  expect(JSON.parse(JSON.stringify(r.output))).toEqual(r.output);
});
