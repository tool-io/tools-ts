import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiplomaticProtocolCheckerInput = {
  readonly charterText: string;
};

export type DiplomaticProtocolCheckerOutput = {
  readonly detectedElements: readonly string[];
  readonly missingElements: readonly string[];
  readonly completenessScore: number;
};

const PROTOCOL_CHECKS: readonly {
  readonly id: string;
  readonly present: (text: string) => boolean;
}[] = [
  {
    id: "invocation",
    present: (t) =>
      /\bin nomine\b/.test(t) || t.includes("signum sanctae crucis"),
  },
  {
    id: "intitulation",
    present: (t) => /\bego\b/.test(t) || /\bnos\b/.test(t),
  },
  {
    id: "corroboration",
    present: (t) =>
      /(signum manus|roboravi|roboravit|roboravimus|confirmavi|confirmavit|subscripsi|subscripsit)/.test(
        t,
      ),
  },
  {
    id: "datation",
    present: (t) => /\b(actum|datum|data|anno)\b/.test(t),
  },
];

export const calculateDiplomaticProtocolChecker = (
  input: DiplomaticProtocolCheckerInput,
): DiplomaticProtocolCheckerOutput => {
  if (input.charterText.trim().length === 0)
    return simpleError(
      "charterText",
      "Provide the charter text to inspect.",
      "invalid_text",
    );
  const lower = input.charterText.toLowerCase();
  const detectedElements = PROTOCOL_CHECKS.filter((check) =>
    check.present(lower),
  ).map((check) => check.id);
  const missingElements = PROTOCOL_CHECKS.filter(
    (check) => !check.present(lower),
  ).map((check) => check.id);
  return {
    detectedElements,
    missingElements,
    completenessScore: detectedElements.length / PROTOCOL_CHECKS.length,
  };
};

export const diplomaticProtocolCheckerExample = {
  input: {
    charterText:
      "In nomine sancte et individue trinitatis. Ego Willelmus Dei gratia rex Anglorum omnibus fidelibus salutem. Hanc cartam sigilli mei impressione roboravi. Datum per manum Ricardi cancellarii apud Westmonasterium, anno domini MCCXCVII.",
  },
  output: {
    detectedElements: [
      "invocation",
      "intitulation",
      "corroboration",
      "datation",
    ],
    missingElements: [],
    completenessScore: 1,
  },
} satisfies ToolExample<
  DiplomaticProtocolCheckerInput,
  DiplomaticProtocolCheckerOutput
>;

export const diplomaticProtocolCheckerTool = createSimpleTool({
  id: "paleography/diplomatic-protocol-checker",
  title: "Diplomatic Protocol Checker",
  description:
    "Check a charter text for four classic diplomatic protocol elements by keyword heuristic - invocation (in nomine / signum sanctae crucis), intitulation (ego/nos), corroboration (signum manus, robo-, confirmo-, subscribo- forms) and datation (actum/datum/data/anno) - and score completeness out of four.",
  inputs: [
    {
      description: "Charter transcription to inspect.",
      id: "charterText",
      kind: "string",
      label: "Charter text",
    },
  ],
  outputs: [
    {
      description: "Protocol elements found.",
      id: "detectedElements",
      kind: "stringList",
      label: "Detected",
    },
    {
      description: "Protocol elements not found.",
      id: "missingElements",
      kind: "stringList",
      label: "Missing",
    },
    {
      description: "Fraction of the four elements present.",
      id: "completenessScore",
      kind: "number",
      label: "Completeness",
    },
  ],
  calculate: (input) =>
    calculateDiplomaticProtocolChecker({
      charterText: input.charterText as string,
    }),
});

export const runDiplomaticProtocolChecker =
  diplomaticProtocolCheckerTool.execute;
export default diplomaticProtocolCheckerTool;
