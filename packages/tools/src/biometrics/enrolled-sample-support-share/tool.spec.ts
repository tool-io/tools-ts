import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biometrics/enrolled-sample-support-share", () => {
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
        personIds: [],
        sampleIds: [],
        qualityAccepted: [],
        enrollmentVerified: [],
      }),
    ).toEqual({
      ok: true,
      output: {
        people: 0,
        supportedPeople: 0,
        distinctSupportedSamples: 0,
        share: 0,
        defined: false,
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
});

describe("independently reviewed regressions", () => {
  it("duplicate sample records retain unique people and samples", () => {
    const output = calculate({
      personIds: ["p1", "p1"],
      sampleIds: ["a", "a"],
      qualityAccepted: [true, true],
      enrollmentVerified: [true, true],
    });
    expect(output).toMatchObject({
      people: 1,
      supportedPeople: 1,
      distinctSupportedSamples: 1,
      share: 1,
      defined: true,
    });
    expect(
      tool.execute({
        personIds: ["p1", "p1"],
        sampleIds: ["a", "a"],
        qualityAccepted: [true, true],
        enrollmentVerified: [true, true],
      }),
    ).toEqual({ ok: true, output });
  });
});
