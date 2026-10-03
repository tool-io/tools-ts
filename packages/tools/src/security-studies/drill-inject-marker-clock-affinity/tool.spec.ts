import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("security-studies/drill-inject-marker-clock-affinity", () => {
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
        markerTime: 10,
        pauseStart: 10,
        pauseEnd: 20,
        affinity: "after",
      }),
    ).toEqual({ ok: true, output: { adjustedTime: 20 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite markerTime", (value) =>
    expect(tool.execute({ ...example.input, markerTime: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite pauseStart", (value) =>
    expect(tool.execute({ ...example.input, pauseStart: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite pauseEnd", (value) =>
    expect(tool.execute({ ...example.input, pauseEnd: value }).ok).toBe(false),
  );
  it.each([{ affinity: "__invalid_enum__" }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ affinity: "__invalid_enum__" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

// batch 69 reviewed regressions

it("restores the requested side of a removed pause", () => {
  expect(
    calculate({
      markerTime: 10,
      pauseStart: 10,
      pauseEnd: 20,
      affinity: "before",
    }),
  ).toEqual({ adjustedTime: 10 });
  expect(
    calculate({
      markerTime: 10,
      pauseStart: 10,
      pauseEnd: 20,
      affinity: "after",
    }),
  ).toEqual({ adjustedTime: 20 });
  expect(
    calculate({
      markerTime: 15,
      pauseStart: 10,
      pauseEnd: 20,
      affinity: "before",
    }),
  ).toEqual({ adjustedTime: 25 });
});
