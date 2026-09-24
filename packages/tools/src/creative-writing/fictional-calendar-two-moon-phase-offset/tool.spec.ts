import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("creative-writing/fictional-calendar-two-moon-phase-offset", () => {
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
        elapsedDays: 3,
        firstPeriod: 12,
        secondPeriod: 24,
        firstInitialPhase: 0.25,
        secondInitialPhase: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { firstPhase: 0.5, secondPhase: 0.625, separation: 0.125 },
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
    "rejects nonfinite elapsedDays",
    (value) =>
      expect(tool.execute({ ...example.input, elapsedDays: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstPeriod",
    (value) =>
      expect(tool.execute({ ...example.input, firstPeriod: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondPeriod",
    (value) =>
      expect(tool.execute({ ...example.input, secondPeriod: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstInitialPhase",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstInitialPhase: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondInitialPhase",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondInitialPhase: value }).ok,
      ).toBe(false),
  );
  it.each([
    { firstPeriod: 0 },
    { secondPeriod: 0 },
    { firstInitialPhase: -1 },
    { firstInitialPhase: 1 },
    { secondInitialPhase: -1 },
    { secondInitialPhase: 1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
