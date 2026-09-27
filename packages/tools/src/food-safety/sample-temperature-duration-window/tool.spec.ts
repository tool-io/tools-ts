import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("food-safety/sample-temperature-duration-window", () => {
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
        observedStart: 0,
        observedEnd: 10,
        suppliedWindowStart: 10,
        suppliedWindowEnd: 20,
        measuredTemperature: 12,
        suppliedLowerTemperature: 0,
        suppliedUpperTemperature: 10,
      }),
    ).toEqual({
      ok: true,
      output: { overlapDuration: 0, temperatureInside: false },
    });
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
    "rejects nonfinite observedStart",
    (value) =>
      expect(tool.execute({ ...example.input, observedStart: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observedEnd",
    (value) =>
      expect(tool.execute({ ...example.input, observedEnd: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedWindowStart",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedWindowStart: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedWindowEnd",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedWindowEnd: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite measuredTemperature",
    (value) =>
      expect(
        tool.execute({ ...example.input, measuredTemperature: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedLowerTemperature",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedLowerTemperature: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedUpperTemperature",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedUpperTemperature: value }).ok,
      ).toBe(false),
  );
});
