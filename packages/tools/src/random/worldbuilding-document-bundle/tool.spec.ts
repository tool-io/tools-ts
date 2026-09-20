import {
  runWorldbuildingDocumentBundle as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateWorldbuildingDocumentBundle as calculate,
  worldbuildingDocumentBundleExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent closed singleton selection backtracks from receipt", () => {
  const result = calculate({ ...example.input, count: 1 });
  if (!result.ok) throw new Error("success");
  expect(result.output.documents.map((d) => d.id)).toEqual(["n"]);
  expect(result.output.crossReferences).toEqual([]);
});
it("lightweight rejects dangling document and entity tokens", () => {
  expect(
    calculate({
      ...example.input,
      count: 1,
      documents: [{ ...example.input.documents[1], references: ["absent"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "documents.references", code: "invalid_reference" }],
    },
  });
  expect(
    calculate({
      ...example.input,
      count: 1,
      documents: [
        { ...example.input.documents[0], template: "{entity:absent}" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "documents.entityIds", code: "missing_entity_token" }],
    },
  });
});
it("lightweight independent disconnected documents cannot form a related bundle", () => {
  expect(
    calculate({
      ...example.input,
      documents: example.input.documents.map((d) => ({
        ...d,
        template: "Unrelated",
        entityIds: [],
        references: [],
      })),
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "count", code: "infeasible_reference_closure" }],
    },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
