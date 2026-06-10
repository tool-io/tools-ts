import { describe, expect, it } from "vitest";
import {
  isToolValueType,
  toolValuePrimitives,
  toolValueTypeKey,
  type ToolValueType,
} from "./value-type.js";

describe("portable value types", () => {
  it("keeps the version 1 carriers fixed and small", () => {
    expect(toolValuePrimitives).toEqual([
      "null",
      "boolean",
      "integer",
      "number",
      "string",
      "bytes",
      "list",
      "object",
    ]);
  });

  it.each<ToolValueType>([
    { type: "string" },
    { format: "base64", type: "string" },
    { format: "image/png", type: "bytes" },
    { format: "length", type: "number", unit: "cm" },
    {
      format: "matrix",
      items: { items: { type: "number" }, type: "list" },
      type: "list",
    },
    {
      format: "length",
      type: "number",
      unit: "fictional/star-trek/enterprise-d",
    },
  ])("accepts open and recursive descriptor %#", (valueType) => {
    expect(isToolValueType(valueType)).toBe(true);
  });

  it.each([
    undefined,
    {},
    { type: "function" },
    { format: "", type: "string" },
    { type: "number", unit: "   " },
    { items: { type: "number" }, type: "object" },
    { items: { type: "function" }, type: "list" },
  ])("rejects invalid descriptor %#", (valueType) => {
    expect(isToolValueType(valueType)).toBe(false);
  });

  it("produces an unambiguous recursive hash-map key", () => {
    expect(
      toolValueTypeKey({
        format: "matrix",
        items: { items: { type: "number" }, type: "list" },
        type: "list",
      }),
    ).toBe(
      '["list","matrix",null,["list",null,null,["number",null,null,null]]]',
    );

    expect(
      toolValueTypeKey({ format: "length|historic", type: "number", unit: "m" }),
    ).not.toBe(
      toolValueTypeKey({ format: "length", type: "number", unit: "historic|m" }),
    );
  });

  it("ignores additive properties from newer descriptor revisions", () => {
    expect(
      isToolValueType({
        futureAnnotation: "understood by a newer client",
        type: "string",
      }),
    ).toBe(true);
  });
});
