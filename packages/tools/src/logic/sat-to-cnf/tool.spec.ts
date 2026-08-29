import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical logic/sat-to-cnf result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));
describe("Tseitin CNF", () => {
  it("encodes an AND with an asserted root", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output.clauses.at(-1)).toHaveLength(1);
  });
});
