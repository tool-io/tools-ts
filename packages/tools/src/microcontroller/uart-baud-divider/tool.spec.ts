import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateUartBaudDivider, example } from "./tool.js";

describe("microcontroller/uart-baud-divider", () => {
  it("matches its worked example", () => {
    expect(calculateUartBaudDivider(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, clockHertz: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative clockHertz", () => {
    expect(tool.execute({ ...example.input, clockHertz: -1 }).ok).toBe(false);
  });
});
