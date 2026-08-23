import { describe, expect, it } from "vitest";
import {
  queryStringExample,
  calculateQueryString,
  runQueryString,
} from "./tool.js";

describe("format/query-string", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQueryString(queryStringExample.input)).toEqual({
      ok: true,
      output: queryStringExample.output,
    });
  });
});
