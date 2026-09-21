import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("andragogy/mentoring-turn-credit-balance", () => {
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
        mentorMinutes: 20,
        learnerMinutes: 20,
        simultaneousMinutes: 20,
        allocatedMentorShare: 0.25,
      }),
    ).toEqual({
      ok: true,
      output: { contactMinutes: 20, mentorCredit: 5, learnerCredit: 15 },
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
    "rejects nonfinite mentorMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, mentorMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite learnerMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, learnerMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite simultaneousMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, simultaneousMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite allocatedMentorShare",
    (value) =>
      expect(
        tool.execute({ ...example.input, allocatedMentorShare: value }).ok,
      ).toBe(false),
  );
  it.each([
    { mentorMinutes: -1 },
    { learnerMinutes: -1 },
    { simultaneousMinutes: -1 },
    { allocatedMentorShare: -1 },
    { allocatedMentorShare: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { mentorMinutes: -1 },
    { learnerMinutes: -1 },
    { simultaneousMinutes: -1 },
    { allocatedMentorShare: -1 },
    { allocatedMentorShare: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
