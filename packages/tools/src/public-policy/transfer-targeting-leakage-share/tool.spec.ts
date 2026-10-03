import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("public-policy/transfer-targeting-leakage-share", () => {
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
        totalRecipients: 80,
        ineligibleRecipients: 20,
        totalTransfer: 2000,
        ineligibleTransfer: 100,
      }),
    ).toEqual({
      ok: true,
      output: {
        recipientLeakage: 0.25,
        amountLeakage: 0.05,
        eligibleTransfer: 1900,
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
    "rejects nonfinite totalRecipients",
    (value) =>
      expect(
        tool.execute({ ...example.input, totalRecipients: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite ineligibleRecipients",
    (value) =>
      expect(
        tool.execute({ ...example.input, ineligibleRecipients: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite totalTransfer",
    (value) =>
      expect(tool.execute({ ...example.input, totalTransfer: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite ineligibleTransfer",
    (value) =>
      expect(
        tool.execute({ ...example.input, ineligibleTransfer: value }).ok,
      ).toBe(false),
  );
  it.each([
    { totalRecipients: 0 },
    { ineligibleRecipients: -1 },
    { totalTransfer: 0 },
    { ineligibleTransfer: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
