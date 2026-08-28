import { describe, expect, it } from "vitest";
import { runParallelQFactor } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runParallelQFactor>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runParallelQFactor>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Parallel Q Factor", () => {
  it("computes the Q factor of an LC tank", () =>
    expect(
      runParallelQFactor({ cFarads: 1e-9, lHenry: 0.001, rOhms: 8 }),
    ).toEqual({ ok: true, output: { qFactorParallel: 125 } }));
  it("computes the Q factor for a 100pF tank", () =>
    expect(
      output(runParallelQFactor({ cFarads: 100e-12, lHenry: 1e-3, rOhms: 50 }))
        .qFactorParallel,
    ).toBeCloseTo(63.24555320336758, 9));
  it("computes the Q factor for a low-Q coil", () =>
    expect(
      output(runParallelQFactor({ cFarads: 1e-6, lHenry: 0.1, rOhms: 10 }))
        .qFactorParallel,
    ).toBeCloseTo(31.622776601683793, 9));
  it("rejects a zero resistance", () => {
    const result = runParallelQFactor({
      cFarads: 1e-9,
      lHenry: 0.001,
      rOhms: 0,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a zero inductance", () => {
    const result = runParallelQFactor({ cFarads: 1e-9, lHenry: 0, rOhms: 8 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a zero capacitance", () => {
    const result = runParallelQFactor({ cFarads: 0, lHenry: 0.001, rOhms: 8 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative capacitance", () =>
    expect(
      runParallelQFactor({ cFarads: -1e-9, lHenry: 0.001, rOhms: 8 }).ok,
    ).toBe(false));
});
