import { describe, expect, it } from "vitest";
import {
  lookupMovementHolderUse,
  movementHolderExample,
  runMovementHolder,
} from "./tool.js";

describe("movement-holder use and limitation lookup", () => {
  it("reproduces the canonical compatibility example", () => {
    expect(runMovementHolder(movementHolderExample.input)).toEqual({
      ok: true,
      output: movementHolderExample.output,
    });
  });

  it("states the holder's stabilization purpose", () => {
    expect(
      lookupMovementHolderUse({ holderFocus: "purpose" }).keyConcern,
    ).toContain("stabilizes");
  });

  it("protects moving components at support points", () => {
    expect(
      lookupMovementHolderUse({ holderFocus: "supportPoints" }).keyConcern,
    ).toContain("jewels");
  });

  it("covers clamping distortion risk", () => {
    expect(
      lookupMovementHolderUse({ holderFocus: "clamping" }).keyConcern,
    ).toContain("distort");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runMovementHolder({ holderFocus: "torque" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "holderFocus" }] },
      ok: false,
    });
  });
});
