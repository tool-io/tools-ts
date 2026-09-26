import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-engineering/activated-sludge-solids-inventory-term", () => {
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
        aerationVolume: 200,
        aerationSolids: 2,
        clarifierVolume: 40,
        clarifierSolids: 5,
        wastedMassPerDay: 50,
        effluentMassPerDay: 10,
      }),
    ).toEqual({
      ok: true,
      output: { inventory: 600, solidsRetentionDays: 10 },
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
    "rejects nonfinite aerationVolume",
    (value) =>
      expect(tool.execute({ ...example.input, aerationVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite aerationSolids",
    (value) =>
      expect(tool.execute({ ...example.input, aerationSolids: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite clarifierVolume",
    (value) =>
      expect(
        tool.execute({ ...example.input, clarifierVolume: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite clarifierSolids",
    (value) =>
      expect(
        tool.execute({ ...example.input, clarifierSolids: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite wastedMassPerDay",
    (value) =>
      expect(
        tool.execute({ ...example.input, wastedMassPerDay: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite effluentMassPerDay",
    (value) =>
      expect(
        tool.execute({ ...example.input, effluentMassPerDay: value }).ok,
      ).toBe(false),
  );
  it.each([
    { aerationVolume: -1 },
    { aerationSolids: -1 },
    { clarifierVolume: -1 },
    { clarifierSolids: -1 },
    { wastedMassPerDay: -1 },
    { effluentMassPerDay: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
