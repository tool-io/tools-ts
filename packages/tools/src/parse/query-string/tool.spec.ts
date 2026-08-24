import { describe, expect, it } from "vitest";
import {
  queryStringExample,
  calculateQueryString,
  runQueryString,
} from "./tool.js";

describe("parse/query-string", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQueryString(queryStringExample.input)).toEqual({
      ok: true,
      output: queryStringExample.output,
    });
  });
  it("rejects invalid input (invalid_query_string)", () => {
    expect(runQueryString({ queryString: "a=%zz" }).ok).toBe(false);
  });
});
