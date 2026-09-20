import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  example,
  calculateUrlFragmentRoutingFixture,
  runUrlFragmentRoutingFixture,
} from "./index.js";
describe("url-fragment-routing-fixture", () => {
  it("lightweight canonical calculation, index runner and schema contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateUrlFragmentRoutingFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(runUrlFragmentRoutingFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("lightweight replay, seed precedence, advancing checked sources and immutability", () => {
    const saved = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(saved)).toEqual(tool.execute(example.input));
    expect(saved).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("seed wins");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...input } = example.input;
    expect(tool.execute(input)).toEqual(tool.execute(input));
    let draws = 0;
    const contextual = tool.execute(input, {
      random: () => {
        draws += 1;
        return 0.25;
      },
    });
    expect(contextual.ok).toBe(true);
    expect(draws).toBeGreaterThan(0);
    if (contextual.ok) {
      expect(contextual.output.randomness).toEqual({
        source: "context",
        seed: null,
      });
      expect(matchesToolJsonSchema(contextual.output, tool.outputSchema)).toBe(
        true,
      );
    }
    for (const random of [
      () => NaN,
      () => 1,
      () => -0.1,
      () => {
        throw new Error("source failed");
      },
    ])
      expect(tool.execute(input, { random })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
  });
  it("lightweight complete missing-field diagnostics and stable boundaries", () => {
    const missing = tool.execute({});
    if (missing.ok) throw new Error("Expected required fields");
    expect(missing.error.issues.map((i) => [i.field, i.code])).toEqual(
      (tool.inputSchema.required ?? []).map((field) => [
        field,
        "required_field",
      ]),
    );
    expect(missing.error.issues).toHaveLength(
      tool.inputSchema.required?.length ?? 0,
    );
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ field: "", code: "object_required" }] },
    });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: Infinity })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, modes: ["raw"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "modes", code: "invalid_field" }] },
    });
  });
  it("lightweight independent model case and invariant", () => {
    const r = tool.execute({ ...example.input, modes: ["empty"] });
    if (!r.ok) throw new Error("success");
    expect(r.output.cases[0]).toMatchObject({ hash: "", hasDelimiter: true });
    const a = tool.execute({ ...example.input, modes: ["absent"] });
    if (!a.ok) throw new Error("success");
    expect(a.output.cases[0]).toMatchObject({ hash: "", hasDelimiter: false });
  });
});
