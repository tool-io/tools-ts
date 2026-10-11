import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("physics/wave-phase-at-supplied-origin", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(
      tool.execute({
        waveNumberRadiansPerMeter: 1,
        angularFrequencyRadiansPerSecond: 2,
        positionMeters: 0,
        timeSeconds: 0,
        suppliedPhaseRadians: 0.25,
      }),
    ).toEqual({ ok: true, output: { phaseRadians: 0.25 } });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite waveNumberRadiansPerMeter",
    (value) =>
      expect(
        tool.execute({ ...example.input, waveNumberRadiansPerMeter: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite angularFrequencyRadiansPerSecond",
    (value) =>
      expect(
        tool.execute({
          ...example.input,
          angularFrequencyRadiansPerSecond: value,
        }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite positionMeters",
    (value) =>
      expect(tool.execute({ ...example.input, positionMeters: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite timeSeconds",
    (value) =>
      expect(tool.execute({ ...example.input, timeSeconds: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedPhaseRadians",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedPhaseRadians: value }).ok,
      ).toBe(false),
  );
});
