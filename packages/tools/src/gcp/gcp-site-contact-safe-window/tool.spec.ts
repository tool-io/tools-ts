import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("gcp/gcp-site-contact-safe-window", () => {
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
        localMinute: 60,
        startMinute: 1320,
        endMinute: 120,
        permittedDays: [0, 6],
        localDay: 0,
        channel: "email",
        allowedChannels: ["phone"],
      }),
    ).toEqual({
      ok: true,
      output: {
        timeAllowed: true,
        dayAllowed: true,
        channelAllowed: false,
        matches: false,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite localMinute",
    (value) =>
      expect(tool.execute({ ...example.input, localMinute: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite startMinute",
    (value) =>
      expect(tool.execute({ ...example.input, startMinute: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite endMinute", (value) =>
    expect(tool.execute({ ...example.input, endMinute: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite localDay", (value) =>
    expect(tool.execute({ ...example.input, localDay: value }).ok).toBe(false),
  );
  it.each([
    { localMinute: -1 },
    { localMinute: 1440 },
    { startMinute: -1 },
    { startMinute: 1440 },
    { endMinute: -1 },
    { endMinute: 1440 },
    { localDay: -1 },
    { localDay: 7 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { localMinute: -1 },
    { localMinute: 1440 },
    { startMinute: -1 },
    { startMinute: 1440 },
    { endMinute: -1 },
    { endMinute: 1440 },
    { localDay: -1 },
    { localDay: 7 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 67 review regressions", () => {
  it("treats an overnight window as half-open at its ending minute", () => {
    expect(
      calculate({
        localMinute: 60,
        startMinute: 1320,
        endMinute: 120,
        permittedDays: [0],
        localDay: 0,
        channel: "phone",
        allowedChannels: ["phone"],
      }),
    ).toEqual({
      timeAllowed: true,
      dayAllowed: true,
      channelAllowed: true,
      matches: true,
    });
    expect(
      calculate({
        localMinute: 120,
        startMinute: 1320,
        endMinute: 120,
        permittedDays: [0],
        localDay: 0,
        channel: "phone",
        allowedChannels: ["phone"],
      }),
    ).toEqual({
      timeAllowed: false,
      dayAllowed: true,
      channelAllowed: true,
      matches: false,
    });
  });
});
