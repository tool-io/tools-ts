import { describe, expect, it } from "vitest";
import {
  leafDryMatterContentExample,
  runLeafDryMatterContent,
} from "./tool.js";

describe("LDMC Percent", () => {
  it("matches the canonical example", () => {
    expect(runLeafDryMatterContent(leafDryMatterContentExample.input)).toEqual({
      ok: true,
      output: leafDryMatterContentExample.output,
    });
  });

  it("reports one hundred percent for fully desiccated tissue", () => {
    expect(
      runLeafDryMatterContent({ leafDryMassG: 2, leafFreshMassG: 2 }),
    ).toEqual({ ok: true, output: { leafDryMatterContentPercent: 100 } });
  });

  it("reports low dry matter for succulent tissue", () => {
    expect(
      runLeafDryMatterContent({ leafDryMassG: 0.5, leafFreshMassG: 10 }),
    ).toEqual({ ok: true, output: { leafDryMatterContentPercent: 5 } });
  });

  it("scales proportionally with the fresh mass", () => {
    expect(
      runLeafDryMatterContent({ leafDryMassG: 1.5, leafFreshMassG: 6 }),
    ).toEqual({ ok: true, output: { leafDryMatterContentPercent: 25 } });
  });

  it("rejects a zero fresh mass", () => {
    const result = runLeafDryMatterContent({
      leafDryMassG: 1,
      leafFreshMassG: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "leafFreshMassG",
      });
  });

  it("rejects dry mass above fresh mass with a stable code", () => {
    const result = runLeafDryMatterContent({
      leafDryMassG: 3,
      leafFreshMassG: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_masses",
        field: "leafDryMassG",
      });
  });

  it("rejects a negative fresh mass through the schema and guard", () => {
    expect(
      runLeafDryMatterContent({ leafDryMassG: 1, leafFreshMassG: -5 }).ok,
    ).toBe(false);
  });
});
