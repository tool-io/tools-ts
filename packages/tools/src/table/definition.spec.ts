import { describe, expect, it } from "vitest";
import {
  createTableDocument,
  validateTableData,
  validateTableSpec,
} from "./definition.js";
import type { TableData, TableDataType, TableJsonValue } from "./definition.js";

const tableWith = (
  dataType: TableDataType,
  value: TableJsonValue,
): TableData => ({
  kind: "tool.io/table",
  rows: [[value]],
  schema: {
    fields: [{ dataType, id: "value", nullable: false }],
  },
  version: 1,
});

describe("TableData validation", () => {
  it("rejects impossible calendar dates", () => {
    expect(
      validateTableData(tableWith({ kind: "date" }, "2025-02-29")).map(
        ({ code }) => code,
      ),
    ).toContain("invalid_cell");
  });

  it("enforces declared integer bit ranges", () => {
    expect(
      validateTableData(
        tableWith({ bits: 8, kind: "integer", signed: false }, 256),
      ).map(({ code }) => code),
    ).toContain("invalid_cell");
    expect(
      validateTableData(
        tableWith({ bits: 8, kind: "integer", signed: false }, 255),
      ),
    ).toEqual([]);
  });

  it("rejects undeclared primary-key fields and properties", () => {
    const value = {
      ...tableWith({ kind: "string" }, "A"),
      privateState: true,
      schema: {
        fields: [
          { dataType: { kind: "string" }, id: "value", nullable: false },
        ],
        primaryKey: ["missing"],
      },
    };
    expect(validateTableData(value).map(({ code }) => code)).toEqual(
      expect.arrayContaining(["invalid_primary_key", "unknown_table_property"]),
    );
  });

  it("enforces decimal precision and scale", () => {
    expect(
      validateTableData(
        tableWith({ kind: "decimal", precision: 5, scale: 2 }, "123.456"),
      ).map(({ code }) => code),
    ).toContain("invalid_cell");
  });

  it("validates partial tool specs and warns about unknown sort fields", () => {
    expect(
      validateTableSpec(
        {
          columns: [{ field: "value" }],
          options: { pageSize: 25, striped: true },
        },
        true,
      ),
    ).toEqual([]);
    expect(validateTableSpec({ options: { pageSize: 0 } }, true)).not.toEqual(
      [],
    );
    const data = tableWith({ kind: "string" }, "A");
    expect(
      createTableDocument(data, {
        defaultSort: [{ direction: "ascending", field: "missing" }],
      }).warnings.map(({ code }) => code),
    ).toContain("unknown_sort_field");
  });
});
