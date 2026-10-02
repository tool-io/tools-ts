import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("political-science/referendum-double-majority-one-condition", () => {
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
        yesVotes: 600,
        validVotes: 1000,
        supportingRegions: 5,
        totalRegions: 10,
        voteThreshold: 0.5,
        regionThreshold: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { votePass: true, regionPass: false, bothPass: false },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite yesVotes", (value) =>
    expect(tool.execute({ ...example.input, yesVotes: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite validVotes", (value) =>
    expect(tool.execute({ ...example.input, validVotes: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite supportingRegions",
    (value) =>
      expect(
        tool.execute({ ...example.input, supportingRegions: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite totalRegions",
    (value) =>
      expect(tool.execute({ ...example.input, totalRegions: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite voteThreshold",
    (value) =>
      expect(tool.execute({ ...example.input, voteThreshold: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite regionThreshold",
    (value) =>
      expect(
        tool.execute({ ...example.input, regionThreshold: value }).ok,
      ).toBe(false),
  );
  it.each([
    { yesVotes: -1 },
    { validVotes: 0 },
    { supportingRegions: -1 },
    { totalRegions: 0 },
    { voteThreshold: -1 },
    { voteThreshold: 2 },
    { regionThreshold: -1 },
    { regionThreshold: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
