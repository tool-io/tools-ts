import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";

export const exampleCollectionFingerprint = (collection) =>
  createHash("sha256")
    .update(
      JSON.stringify({
        catalogFingerprint: collection.catalogFingerprint,
        examples: collection.examples,
        schemaVersion: collection.schemaVersion,
      }),
    )
    .digest("hex");

export const createExampleMetadata = ({
  id,
  contractVersion,
  contractFingerprint,
  example,
}) => {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(id) ||
    !Number.isSafeInteger(contractVersion) ||
    contractVersion < 1 ||
    !/^[0-9a-f]{64}$/.test(contractFingerprint)
  )
    throw new Error("Invalid example identity.");
  if (
    typeof example !== "object" ||
    example === null ||
    Array.isArray(example) ||
    !Object.hasOwn(example, "input") ||
    Object.keys(example).some((key) => !["input", "output"].includes(key))
  )
    throw new Error(`${id}: a canonical example with input is required.`);
  let restored;
  try {
    restored = JSON.parse(JSON.stringify(example));
  } catch {
    throw new Error(`${id}: canonical example must be portable JSON.`);
  }
  if (!isDeepStrictEqual(restored, example))
    throw new Error(
      `${id}: canonical example changes during a JSON round trip.`,
    );
  return { id, contractVersion, contractFingerprint, example: restored };
};

export const createExampleCollection = (catalogFingerprint, entries) => {
  if (!/^[0-9a-f]{64}$/.test(catalogFingerprint))
    throw new Error("Invalid catalog fingerprint.");
  const examples = [...entries].sort((a, b) => a.id.localeCompare(b.id, "en"));
  if (new Set(examples.map((entry) => entry.id)).size !== examples.length)
    throw new Error("Duplicate canonical example ID.");
  const payload = { catalogFingerprint, examples, schemaVersion: 1 };
  return {
    examplesFingerprint: exampleCollectionFingerprint(payload),
    ...payload,
  };
};
