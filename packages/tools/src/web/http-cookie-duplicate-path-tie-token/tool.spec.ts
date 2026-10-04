import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("web/http-cookie-duplicate-path-tie-token", () => {
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
        names: ["id", "id"],
        pathLengths: [4, 4],
        creationOrders: [2, 1],
        requestedName: "id",
      }),
    ).toEqual({ ok: true, output: { selectedIndex: 1 } });
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

// batch 69 reviewed regressions

it("uses longer path before earlier creation and flags an absent name", () => {
  expect(
    calculate({
      names: ["id", "id"],
      pathLengths: [1, 4],
      creationOrders: [0, 1],
      requestedName: "id",
    }),
  ).toEqual({ selectedIndex: 1 });
  expect(
    calculate({
      names: ["id"],
      pathLengths: [4],
      creationOrders: [0],
      requestedName: "other",
    }),
  ).toEqual({ selectedIndex: -1 });
});
