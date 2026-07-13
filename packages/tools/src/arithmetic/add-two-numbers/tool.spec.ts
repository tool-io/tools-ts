import { describe, expect, it } from "vitest";
import {
  addTwoNumbersExample,
  addTwoNumbersTool,
  runAddTwoNumbers,
} from "./tool.js";

describe("Add Two Numbers Calculator", () => {
  it("adds positive and negative values", () =>
    expect(runAddTwoNumbers({ first: 8, second: -3 })).toEqual({
      ok: true,
      output: { sum: 5 },
    }));

  it("rejects missing and non-finite values", () => {
    expect(runAddTwoNumbers({ first: 1 }).ok).toBe(false);
    expect(runAddTwoNumbers({ first: Infinity, second: 1 }).ok).toBe(false);
  });

  it("returns a structured output error when the finite sum overflows", () => {
    expect(
      runAddTwoNumbers({ first: Number.MAX_VALUE, second: Number.MAX_VALUE }),
    ).toEqual({
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "invalid_output",
            field: "sum",
            message: "Sum could not be calculated.",
          },
        ],
      },
      ok: false,
    });
  });

  it("publishes a coherent input-only example with semantic field descriptions", () => {
    expect(JSON.parse(JSON.stringify(addTwoNumbersExample))).toEqual(
      addTwoNumbersExample,
    );
    expect(runAddTwoNumbers(addTwoNumbersExample.input)).toEqual({
      ok: true,
      output: { sum: 5 },
    });
    expect(addTwoNumbersExample).not.toHaveProperty("output");
    expect(addTwoNumbersTool.ports.inputs).toMatchObject([
      { description: "The first number to add." },
      { description: "The second number to add." },
    ]);
    expect(addTwoNumbersTool.inputSchema.properties).toMatchObject({
      first: { description: "The first number to add." },
      second: { description: "The second number to add." },
    });
  });
});
