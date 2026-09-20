import {
  runRehearsalLineCueOmission as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateRehearsalLineCueOmission as calculate,
  rehearsalLineCueOmissionExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent retained context is visible in student script", () => {
  const result = calculate({
    ...example.input,
    lines: [...example.input.lines, { id: "d", speaker: "Ivo", text: "Yes." }],
    omissionCount: 2,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.omissions.map((o) => o.lineId)).toEqual(["b", "d"]);
  expect(
    result.output.omissions.flatMap((o) => o.precedingContext.map((c) => c.id)),
  ).toEqual(["a", "c"]);
});
it("lightweight impossible adjacent omissions and first-line preservation", () => {
  expect(calculate({ ...example.input, omissionCount: 2 })).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "omissionCount", code: "infeasible_omissions" }],
    },
  });
  expect(calculate({ ...example.input, contextLines: 0 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "contextLines", code: "invalid_field" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
