import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { assertContractCollectionMatchesSchema } from "./contract-schema-validation.mjs";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (relativePath) =>
  readFile(path.join(root, relativePath), "utf8").then(JSON.parse);
const [collectionSchema, toolSchema] = await Promise.all([
  readJson("contracts/tool-contract-collection.schema.json"),
  readJson("contracts/tool-contract.schema.json"),
]);

describe("generated contract schema validation", () => {
  it("accepts a portable contract collection", () => {
    assert.doesNotThrow(() =>
      assertContractCollectionMatchesSchema({
        collection: {
          contracts: [
            {
              contractVersion: 1,
              description: "Return the supplied finite number.",
              execution: { kind: "pure" },
              id: "example/identity",
              inputSchema: {
                additionalProperties: false,
                properties: { value: { type: "number" } },
                required: ["value"],
                type: "object",
              },
              outputSchema: {
                additionalProperties: false,
                properties: { value: { type: "number" } },
                required: ["value"],
                type: "object",
              },
              ports: {
                inputs: [
                  {
                    id: "value",
                    label: "Value",
                    required: true,
                    valueType: { type: "number" },
                  },
                ],
                outputs: [
                  {
                    id: "value",
                    label: "Value",
                    presentation: { kind: "table", version: 1 },
                    valueType: { type: "number" },
                  },
                ],
              },
              title: "Identity",
            },
          ],
          schemaVersion: 1,
        },
        collectionSchema,
        toolSchema,
      }),
    );
  });

  it("rejects contract fields absent from the public schema", () => {
    assert.throws(
      () =>
        assertContractCollectionMatchesSchema({
          collection: {
            contracts: [{ id: "incomplete", privateState: true }],
            schemaVersion: 1,
          },
          collectionSchema,
          toolSchema,
        }),
      /do not match the public JSON Schema/,
    );
  });
});
