import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("media-studies/audience-diary-simultaneous-media-time-share", () => {
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
        firstMediumMinutes: 20,
        secondMediumMinutes: 20,
        simultaneousMinutes: 20,
        observationMinutes: 60,
      }),
    ).toEqual({
      ok: true,
      output: { unionMinutes: 20, unionShare: 0.3333333333333333 },
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
    "rejects nonfinite firstMediumMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstMediumMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondMediumMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondMediumMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite simultaneousMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, simultaneousMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observationMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, observationMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([
    { firstMediumMinutes: -1 },
    { secondMediumMinutes: -1 },
    { simultaneousMinutes: -1 },
    { observationMinutes: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstMediumMinutes: -1 },
    { secondMediumMinutes: -1 },
    { simultaneousMinutes: -1 },
    { observationMinutes: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
