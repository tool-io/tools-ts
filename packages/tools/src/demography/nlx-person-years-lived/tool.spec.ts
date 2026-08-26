import { describe, expect, it } from "vitest";
import {
  calculateNlxPersonYearsLived,
  nlxPersonYearsLivedExample,
  runNlxPersonYearsLived,
} from "./tool.js";

describe("demography/nlx-person-years-lived", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNlxPersonYearsLived(nlxPersonYearsLivedExample.input)).toEqual({
      ok: true,
      output: nlxPersonYearsLivedExample.output,
    });
  });

  it("uses the open-terminal formula when nmx is given", () => {
    const result = calculateNlxPersonYearsLived({
      age: 100,
      n: 5,
      lx: 1200,
      nmx: 0.4,
    });
    expect(result.personYearsLived).toBe(3000);
    expect(result.intervalType).toBe("open");
  });

  it("rejects a zero-width interval and a missing successor value", () => {
    expect(runNlxPersonYearsLived({ n: 0, lx: 10000, lxNext: 9000 }).ok).toBe(
      false,
    );
    expect(runNlxPersonYearsLived({ n: 5, lx: 1200 }).ok).toBe(false);
    expect(runNlxPersonYearsLived({ n: 5, lx: 100, lxNext: 101 }).ok).toBe(
      false,
    );
  });
});
