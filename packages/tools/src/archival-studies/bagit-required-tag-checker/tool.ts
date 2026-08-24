import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BagitRequiredTagCheckerInput = {
  readonly requiredTags: readonly string[];
  readonly presentTags: readonly string[];
};

export type BagitRequiredTagCheckerOutput = {
  readonly missingTags: readonly string[];
  readonly allPresent: boolean;
};

const uniqueByCaseFold = (values: readonly string[]): string[] => {
  const unique = new Map<string, string>();
  for (const value of values) {
    const key = value.toLocaleLowerCase("en-US");
    if (!unique.has(key)) unique.set(key, value);
  }
  return [...unique.values()].sort((a, b) => a.localeCompare(b, "en-US"));
};

export const calculateBagitRequiredTagChecker = (
  input: BagitRequiredTagCheckerInput,
): BagitRequiredTagCheckerOutput => {
  const requiredTags = input.requiredTags;
  const presentTags = input.presentTags;
  for (const [key, value] of [
    ["requiredTags", requiredTags],
    ["presentTags", presentTags],
  ] as const) {
    if (!Array.isArray(value))
      simpleError(key, "Tag lists must be arrays.", "invalid_tag_list");
    for (let i = 0; i < (value as readonly string[]).length; i += 1) {
      const entry = (value as readonly string[])[i] as string;
      if (typeof entry !== "string" || entry.trim() === "")
        simpleError(
          key,
          "Tag lists must contain non-empty strings.",
          "invalid_tag_list",
        );
      if (entry.length > 1000)
        simpleError(
          key,
          "Tag name exceeds maximum length.",
          "invalid_tag_list",
        );
    }
  }
  const present = new Set(
    (presentTags as readonly string[]).map((tag) =>
      tag.toLocaleLowerCase("en-US"),
    ),
  );
  const missingTags = uniqueByCaseFold(
    requiredTags as readonly string[],
  ).filter((tag) => !present.has(tag.toLocaleLowerCase("en-US")));
  return { missingTags, allPresent: missingTags.length === 0 };
};

export const bagitRequiredTagCheckerExample = {
  input: {
    requiredTags: ["Bagging-Date", "Payload-Oxum"],
    presentTags: ["bagging-date", "Payload-Oxum"],
  },
  output: { missingTags: [], allPresent: true },
} satisfies ToolExample<
  BagitRequiredTagCheckerInput,
  BagitRequiredTagCheckerOutput
>;

export const bagitRequiredTagCheckerTool = createSimpleTool({
  id: "archival-studies/bagit-required-tag-checker",
  title: "BagIt Profile Required Tag Presence Checker",
  description:
    "Check which bag-info metadata elements required by a BagIt profile are absent, using the case-insensitive element-name comparison required by RFC 8493 while preserving the requested spelling in the result.",
  inputs: [
    {
      description: "Tag names the profile requires.",
      id: "requiredTags",
      kind: "stringList",
      label: "Required tags",
    },
    {
      description: "Tag names actually present in the bag.",
      id: "presentTags",
      kind: "stringList",
      label: "Present tags",
    },
  ],
  outputs: [
    {
      description: "Required tags missing from the bag, sorted ascending.",
      id: "missingTags",
      kind: "stringList",
      label: "Missing tags",
    },
    {
      description: "True when every required tag is present.",
      id: "allPresent",
      kind: "boolean",
      label: "All present",
    },
  ],
  calculate: (input) =>
    calculateBagitRequiredTagChecker({
      presentTags: input.presentTags as readonly string[],
      requiredTags: input.requiredTags as readonly string[],
    }),
});

export const runBagitRequiredTagChecker = bagitRequiredTagCheckerTool.execute;
export default bagitRequiredTagCheckerTool;
