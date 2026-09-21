import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agribusiness/seasonal-labor-accommodation-cost-share", () => {
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
        workers: 4,
        nights: 3,
        nightlyCost: 30,
        employerFraction: 0.25,
        fixedCost: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        grossCost: 360,
        employerCost: 90,
        workerTotal: 270,
        perWorker: 67.5,
      },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite workers", (value) =>
    expect(tool.execute({ ...example.input, workers: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite nights", (value) =>
    expect(tool.execute({ ...example.input, nights: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite nightlyCost",
    (value) =>
      expect(tool.execute({ ...example.input, nightlyCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite employerFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, employerFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite fixedCost", (value) =>
    expect(tool.execute({ ...example.input, fixedCost: value }).ok).toBe(false),
  );
  it.each([
    { workers: 0 },
    { nights: -1 },
    { nightlyCost: -1 },
    { employerFraction: -1 },
    { employerFraction: 2 },
    { fixedCost: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
