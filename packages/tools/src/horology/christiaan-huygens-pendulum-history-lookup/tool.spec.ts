import { describe, expect, it } from "vitest";
import {
  huygensHistoryExample,
  lookupChristiaanHuygensHistory,
  runHuygensHistory,
} from "./tool.js";

describe("Christiaan Huygens pendulum history lookup", () => {
  it("reproduces the canonical 1657 patent fact", () => {
    expect(runHuygensHistory(huygensHistoryExample.input)).toEqual({
      ok: true,
      output: huygensHistoryExample.output,
    });
  });

  it("dates the working clock to 1656", () => {
    expect(
      lookupChristiaanHuygensHistory({ historyFocus: "invention" }).keyDate,
    ).toBe("1656");
  });

  it("distinguishes Galileo investigation from Huygens construction", () => {
    expect(
      lookupChristiaanHuygensHistory({ historyFocus: "attribution" })
        .verifiedStatement,
    ).toContain("Galileo");
  });

  it("keeps the balance spring distinct from the pendulum clock", () => {
    expect(
      lookupChristiaanHuygensHistory({ historyFocus: "balanceSpring" })
        .verifiedStatement,
    ).toContain("separate portable-watch regulator");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runHuygensHistory({ historyFocus: "tourbillon" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "historyFocus" }] },
      ok: false,
    });
  });
});
