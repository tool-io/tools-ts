import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TheophoricElementDetectorInput = {
  readonly name: string;
};

export type TheophoricElementDetectorOutput = {
  readonly isTheophoric: boolean;
  readonly matchedStem: string;
  readonly deity: string;
};

const STEMS: ReadonlyArray<readonly [string, string]> = [
  ["aphrodit", "Aphrodite"],
  ["asklep", "Asklepios"],
  ["athen", "Athena"],
  ["poseid", "Poseidon"],
  ["demetr", "Demeter"],
  ["herakl", "Herakles"],
  ["hercul", "Hercules"],
  ["dionys", "Dionysus"],
  ["artem", "Artemis"],
  ["mercur", "Mercury"],
  ["neptun", "Neptune"],
  ["serap", "Serapis"],
  ["bacch", "Bacchus"],
  ["apoll", "Apollo"],
  ["anub", "Anubis"],
  ["osir", "Osiris"],
  ["miner", "Minerva"],
  ["vener", "Venus"],
  ["mart", "Mars"],
  ["dian", "Diana"],
  ["herm", "Hermes"],
  ["iov", "Jupiter"],
  ["iun", "Juno"],
  ["zeu", "Zeus"],
];
const ORDERED_STEMS = [...STEMS].sort(
  (left, right) => right[0].length - left[0].length,
);

export const calculateTheophoricElementDetector = (
  input: TheophoricElementDetectorInput,
): TheophoricElementDetectorOutput => {
  const name = input.name.trim();
  if (!name)
    return simpleError(
      "name",
      "The name must be a non-empty string.",
      "empty_name",
    );
  const lowered = name.toLowerCase();
  for (const [stem, deity] of ORDERED_STEMS)
    if (lowered.includes(stem))
      return { isTheophoric: true, matchedStem: stem, deity };
  return { isTheophoric: false, matchedStem: "", deity: "" };
};

export const theophoricElementDetectorExample = {
  input: { name: "Dionysodoros" },
  output: { isTheophoric: true, matchedStem: "dionys", deity: "Dionysus" },
} satisfies ToolExample<
  TheophoricElementDetectorInput,
  TheophoricElementDetectorOutput
>;

export const theophoricElementDetectorTool = createSimpleTool({
  id: "epigraphy/theophoric-element-detector",
  title: "Theophoric Name Element Detector",
  description:
    "Detect theophoric name elements by substring-matching a fixed list of common Greco-Roman divine stems (longest first) and report the matched stem and deity, or a negative result.",
  inputs: [
    {
      description: "Personal name to inspect.",
      id: "name",
      kind: "string",
      label: "Name",
    },
  ],
  outputs: [
    {
      description: "True when a divine stem was found.",
      id: "isTheophoric",
      kind: "boolean",
      label: "Theophoric",
    },
    {
      description: "Matched lowercase divine stem, or empty string.",
      id: "matchedStem",
      kind: "string",
      label: "Matched stem",
    },
    {
      description: "Deity of the matched stem, or empty string.",
      id: "deity",
      kind: "string",
      label: "Deity",
    },
  ],
  calculate: (input) =>
    calculateTheophoricElementDetector(
      input as unknown as TheophoricElementDetectorInput,
    ),
});

export const runTheophoricElementDetector =
  theophoricElementDetectorTool.execute;
export default theophoricElementDetectorTool;
