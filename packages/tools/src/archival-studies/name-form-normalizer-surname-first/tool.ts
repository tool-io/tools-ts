import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NameFormNormalizerSurnameFirstInput = {
  readonly fullName: string;
};

export type NameFormNormalizerSurnameFirstOutput = {
  readonly normalizedName: string;
  readonly surname: string;
  readonly forenames: string;
};

const PARTICLES = new Set([
  "af",
  "av",
  "da",
  "das",
  "de",
  "del",
  "della",
  "den",
  "der",
  "di",
  "do",
  "dos",
  "du",
  "e",
  "i",
  "la",
  "le",
  "op",
  "te",
  "ten",
  "ter",
  "tot",
  "van",
  "von",
  "y",
  "zu",
  "zum",
  "zur",
]);

export const calculateNameFormNormalizerSurnameFirst = (
  input: NameFormNormalizerSurnameFirstInput,
): NameFormNormalizerSurnameFirstOutput => {
  const trimmed = input.fullName.trim();
  if (trimmed.length === 0)
    simpleError("fullName", "Full name must not be empty.", "invalid_name");
  if (trimmed.includes(",")) {
    const separatorIndex = trimmed.indexOf(",");
    const surname = trimmed.slice(0, separatorIndex).trim();
    const forenames = trimmed.slice(separatorIndex + 1).trim();
    if (surname.length === 0)
      simpleError(
        "fullName",
        "Surname before the comma is empty.",
        "invalid_name",
      );
    return {
      normalizedName:
        forenames.length > 0 ? `${surname}, ${forenames}` : surname,
      surname,
      forenames,
    };
  }
  const tokens = trimmed.split(/\s+/);
  let particleIndex = -1;
  for (let index = tokens.length - 2; index >= 1; index -= 1) {
    if (PARTICLES.has(tokens[index].toLowerCase())) {
      particleIndex = index;
      while (
        particleIndex > 1 &&
        PARTICLES.has(tokens[particleIndex - 1].toLowerCase())
      )
        particleIndex -= 1;
      break;
    }
  }
  const forenames =
    particleIndex > 0
      ? tokens.slice(0, particleIndex).join(" ")
      : tokens.slice(0, Math.max(tokens.length - 1, 0)).join(" ");
  const surname =
    particleIndex > 0
      ? tokens.slice(particleIndex).join(" ")
      : tokens[tokens.length - 1];
  return {
    normalizedName: forenames.length > 0 ? `${surname}, ${forenames}` : surname,
    surname,
    forenames,
  };
};

export const nameFormNormalizerSurnameFirstExample = {
  input: { fullName: "Ludwig van Beethoven" },
  output: {
    normalizedName: "van Beethoven, Ludwig",
    surname: "van Beethoven",
    forenames: "Ludwig",
  },
} satisfies ToolExample<
  NameFormNormalizerSurnameFirstInput,
  NameFormNormalizerSurnameFirstOutput
>;

export const nameFormNormalizerSurnameFirstTool = createSimpleTool({
  id: "archival-studies/name-form-normalizer-surname-first",
  title: "Authority Control Name Form Normalizer (surname first)",
  description:
    "Invert a personal name into the inverted catalog form 'Surname, Forename(s)', treating common nobiliary particles as part of the surname; token order is a heuristic.",
  inputs: [
    {
      description: "Personal name in direct or already-inverted order.",
      id: "fullName",
      kind: "string",
      label: "Full name",
    },
  ],
  outputs: [
    {
      description: "Name in 'Surname, Forename(s)' form.",
      id: "normalizedName",
      kind: "string",
      label: "Normalized",
    },
    {
      description: "Surname portion including any particle.",
      id: "surname",
      kind: "string",
      label: "Surname",
    },
    {
      description: "Forename portion; empty when none was given.",
      id: "forenames",
      kind: "string",
      label: "Forenames",
    },
  ],
  calculate: (input) =>
    calculateNameFormNormalizerSurnameFirst({
      fullName: input.fullName as string,
    }),
});

export const runNameFormNormalizerSurnameFirst =
  nameFormNormalizerSurnameFirstTool.execute;
export default nameFormNormalizerSurnameFirstTool;
