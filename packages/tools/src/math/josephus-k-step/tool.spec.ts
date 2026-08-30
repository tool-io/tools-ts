import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, josephusKStepInputSchema, josephusKStepOutputSchema } from "./index.js";

describe("math/josephus-k-step", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, josephusKStepInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, josephusKStepOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      people: 5,
      step: "2",
    })).toEqual({ ok: true, output: {
      survivor: 3,
    } });
    expect(tool.execute({
      people: 41,
      step: "3",
    })).toEqual({ ok: true, output: {
      survivor: 31,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      people: 1,
      step: "9007199254740993",
    })).toEqual({ ok: true, output: {
      survivor: 1,
    } });
    expect(tool.execute({
      people: 5,
      step: "1",
    })).toEqual({ ok: true, output: {
      survivor: 5,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "people", code: "invalid_type" }] } });
    expect(tool.execute({
      people: 7,
      step: "3",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, people: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "people", code: "invalid_type" }] } });
    expect(tool.execute({
      people: 0,
      step: "2",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "people", code: "out_of_range" }] } });
    expect(tool.execute({
      people: 5,
      step: "0",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "step", code: "invalid_format" }] } });
  });

});
