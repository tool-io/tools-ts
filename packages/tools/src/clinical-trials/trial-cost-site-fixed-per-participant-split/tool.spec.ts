import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("clinical-trials/trial-cost-site-fixed-per-participant-split", () => {
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
        siteFixed: 600,
        participantVariable: 40,
        participants: 10,
        sharedCentral: 0,
        siteShare: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        fixedAllocated: 600,
        variableTotal: 400,
        total: 1000,
        perParticipant: 100,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite siteFixed", (value) =>
    expect(tool.execute({ ...example.input, siteFixed: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite participantVariable",
    (value) =>
      expect(
        tool.execute({ ...example.input, participantVariable: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite participants",
    (value) =>
      expect(tool.execute({ ...example.input, participants: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sharedCentral",
    (value) =>
      expect(tool.execute({ ...example.input, sharedCentral: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite siteShare", (value) =>
    expect(tool.execute({ ...example.input, siteShare: value }).ok).toBe(false),
  );
  it.each([
    { siteFixed: -1 },
    { participantVariable: -1 },
    { participants: 0 },
    { sharedCentral: -1 },
    { siteShare: -1 },
    { siteShare: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { siteFixed: -1 },
    { participantVariable: -1 },
    { participants: 0 },
    { sharedCentral: -1 },
    { siteShare: -1 },
    { siteShare: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
