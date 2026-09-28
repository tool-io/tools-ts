import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("graph/edge-biconnected-component-count", () => {
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
        vertices: ["A", "B", "C"],
        sources: ["A", "B", "C"],
        targets: ["B", "C", "A"],
      }),
    ).toEqual({ ok: true, output: { componentCount: 1, bridgeCount: 0 } });
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

  it.each([
    { sources: ["X", "B"] },
    { vertices: ["A", "A"] },
    { sources: ["X", "B"] },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { sources: ["X", "B"] },
    { vertices: ["A", "A"] },
    { sources: ["X", "B"] },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("parallel edges are not bridges", () => {
    const output = calculate({
      vertices: ["A", "B"],
      sources: ["A", "A"],
      targets: ["B", "B"],
    });
    expect(output).toMatchObject({ componentCount: 1, bridgeCount: 0 });
    expect(
      tool.execute({
        vertices: ["A", "B"],
        sources: ["A", "A"],
        targets: ["B", "B"],
      }),
    ).toEqual({ ok: true, output });
  });
  it("self-loops do not bridge distinct vertices", () => {
    const output = calculate({
      vertices: ["A", "B"],
      sources: ["A"],
      targets: ["A"],
    });
    expect(output).toMatchObject({ componentCount: 2, bridgeCount: 0 });
    expect(
      tool.execute({ vertices: ["A", "B"], sources: ["A"], targets: ["A"] }),
    ).toEqual({ ok: true, output });
  });
  it("an isolated vertex adds a component beside a cycle", () => {
    const output = calculate({
      vertices: ["A", "B", "C", "D"],
      sources: ["A", "B", "C"],
      targets: ["B", "C", "A"],
    });
    expect(output).toMatchObject({ componentCount: 2, bridgeCount: 0 });
    expect(
      tool.execute({
        vertices: ["A", "B", "C", "D"],
        sources: ["A", "B", "C"],
        targets: ["B", "C", "A"],
      }),
    ).toEqual({ ok: true, output });
  });
  it("empty graph has no components or bridges", () => {
    const output = calculate({ vertices: [], sources: [], targets: [] });
    expect(output).toMatchObject({ componentCount: 0, bridgeCount: 0 });
    expect(tool.execute({ vertices: [], sources: [], targets: [] })).toEqual({
      ok: true,
      output,
    });
  });
  it("unknown edge endpoints identify the source field", () => {
    expect(
      tool.execute({
        vertices: ["A", "B", "C"],
        sources: ["X", "B"],
        targets: ["B", "C"],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "sources" }],
      },
    });
    expect(() =>
      calculate({
        vertices: ["A", "B", "C"],
        sources: ["X", "B"],
        targets: ["B", "C"],
      }),
    ).toThrow();
  });
});
