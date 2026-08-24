import { describe, expect, it } from "vitest";
import { runTable, tableExample } from "./tool.js";

describe("table", () => {
  it("creates the canonical example document", () => {
    expect(runTable(tableExample.input)).toEqual({
      ok: true,
      output: tableExample.output,
    });
  });

  it("rejects rows that do not match the schema width", () => {
    const result = runTable({
      data: {
        kind: "toolio/table",
        rows: [[1, 2]],
        schema: {
          fields: [
            {
              dataType: { bits: 32, kind: "integer", signed: true },
              id: "value",
              nullable: false,
            },
          ],
        },
        version: 1,
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_row_width");
  });
});
