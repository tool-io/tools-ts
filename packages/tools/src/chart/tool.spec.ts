import { describe, expect, it } from "vitest";
import { chartExample, runChart } from "./tool.js";

describe("chart", () => {
  it("creates a renderer-independent chart document", () => {
    expect(runChart(chartExample.input)).toEqual({
      ok: true,
      output: chartExample.output,
    });
  });

  it("reports an unknown field as a document warning", () => {
    const result = runChart({
      ...chartExample.input,
      spec: {
        ...chartExample.input.spec,
        encoding: {
          ...chartExample.input.spec.encoding,
          y: { field: "missing" },
        },
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.document.warnings[0]?.code).toBe("unknown_field");
  });

  it("rejects undeclared tool inputs", () => {
    expect(
      runChart({ ...chartExample.input, renderer: "canvas" } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "renderer" }] },
      ok: false,
    });
  });
});
