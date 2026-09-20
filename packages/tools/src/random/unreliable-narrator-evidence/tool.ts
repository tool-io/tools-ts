import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateWordWrap } from "../../text/word-wrap/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  snArray,
  snBoundOutput,
  snDistinct,
  snId,
  snInteger,
  snObject,
  snPick,
  snSample,
  snTemplate,
  snText,
} from "../m250-sampling-narrative-support.js";

export type FictionalEvidenceFact = {
  readonly id: string;
  readonly label: string;
  readonly truthValue: string;
  readonly alternativeValues: readonly string[];
  readonly evidenceTemplates: readonly string[];
};
export type UnreliableNarratorEvidenceInput = {
  readonly facts: readonly FictionalEvidenceFact[];
  readonly narratorTemplates: readonly string[];
  readonly count: number;
  readonly contradictionCount: number;
  readonly wrapWidth: number;
  readonly seed?: number;
};
export type EvidenceCard = {
  readonly id: string;
  readonly factId: string;
  readonly text: string;
  readonly lineCount: number;
};
export type UnreliableNarratorEvidenceOutput = {
  readonly statements: readonly EvidenceCard[];
  readonly evidence: readonly EvidenceCard[];
  readonly consistencyKey: readonly {
    readonly statementId: string;
    readonly evidenceId: string;
    readonly factId: string;
    readonly assertedValue: string;
    readonly establishedValue: string;
    readonly contradicts: boolean;
  }[];
  readonly provenance: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = snObject(
  {
    facts: snArray(
      snObject({
        id: snId,
        label: snId,
        truthValue: snId,
        alternativeValues: snArray(snId, 16),
        evidenceTemplates: snArray(snText, 16, 1),
      }),
      64,
      1,
    ),
    narratorTemplates: snArray(snText, 16, 1),
    count: { type: "integer", minimum: 1, maximum: 64 },
    contradictionCount: { type: "integer", minimum: 0, maximum: 64 },
    wrapWidth: { type: "integer", minimum: 1, maximum: 4096 },
    seed: generatorSeedSchema,
  },
  ["facts", "narratorTemplates", "count", "contradictionCount", "wrapWidth"],
);
const cardSchema = snObject({
  id: snId,
  factId: snId,
  text: { type: "string", maxLength: 65536 },
  lineCount: snInteger,
});
export const outputSchema = snObject({
  statements: snArray(cardSchema, 64, 1),
  evidence: snArray(cardSchema, 64, 1),
  consistencyKey: snArray(
    snObject({
      statementId: snId,
      evidenceId: snId,
      factId: snId,
      assertedValue: snId,
      establishedValue: snId,
      contradicts: { type: "boolean" },
    }),
    64,
    1,
  ),
  provenance: { type: "string", const: "caller-supplied-fiction" },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is UnreliableNarratorEvidenceInput =>
  matchesModelInput(input, inputSchema);
export const calculateUnreliableNarratorEvidence = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UnreliableNarratorEvidenceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(
      input.facts.map((fact) => fact.id),
      "facts",
    );
    for (const fact of input.facts) {
      snDistinct(fact.alternativeValues, "facts");
      if (fact.alternativeValues.includes(fact.truthValue))
        simpleError(
          "facts",
          "Alternative values must differ from the established fictional value.",
          "nonconflicting_alternative",
        );
    }
    for (const template of [
      ...input.narratorTemplates,
      ...input.facts.flatMap((fact) => fact.evidenceTemplates),
    ]) {
      snTemplate(template, { label: "", value: "", factId: "" }, "templates");
      if (!template.includes("{value}"))
        simpleError(
          "templates",
          "Every statement and evidence template must render its value.",
          "missing_value_token",
        );
    }
    const conflicting = input.facts.filter(
      (fact) => fact.alternativeValues.length > 0,
    );
    if (
      input.count > input.facts.length ||
      input.contradictionCount > input.count ||
      input.contradictionCount > conflicting.length
    )
      simpleError(
        "contradictionCount",
        "The supplied distinct facts and alternatives cannot satisfy these counts.",
        "infeasible_contradictions",
      );
    const random = createGeneratorRandom(input.seed, context),
      chosenConflicts = snSample(
        conflicting,
        input.contradictionCount,
        false,
        random,
      ),
      conflictIds = new Set(chosenConflicts.map((fact) => fact.id));
    const chosen = [
      ...chosenConflicts,
      ...snSample(
        input.facts.filter((fact) => !conflictIds.has(fact.id)),
        input.count - input.contradictionCount,
        false,
        random,
      ),
    ];
    const statements: EvidenceCard[] = [],
      evidence: EvidenceCard[] = [],
      consistencyKey: UnreliableNarratorEvidenceOutput["consistencyKey"][number][] =
        [];
    chosen.forEach((fact, i) => {
      const assertedValue = conflictIds.has(fact.id)
        ? snPick(fact.alternativeValues, random)
        : fact.truthValue;
      const statementTemplate = snPick(input.narratorTemplates, random),
        evidenceTemplate = snPick(fact.evidenceTemplates, random);
      const statement = calculateWordWrap({
        text: snTemplate(
          statementTemplate,
          { label: fact.label, value: assertedValue, factId: fact.id },
          "templates",
        ),
        width: input.wrapWidth,
      });
      const exhibit = calculateWordWrap({
        text: snTemplate(
          evidenceTemplate,
          { label: fact.label, value: fact.truthValue, factId: fact.id },
          "templates",
        ),
        width: input.wrapWidth,
      });
      if (
        statement.wrappedText.length > 65536 ||
        exhibit.wrappedText.length > 65536
      )
        simpleError(
          "templates",
          "An expanded card exceeds 65536 UTF-16 units.",
          "resource_limit_exceeded",
        );
      const statementId = `statement-${i + 1}`,
        evidenceId = `evidence-${i + 1}`;
      statements.push({
        id: statementId,
        factId: fact.id,
        text: statement.wrappedText,
        lineCount: statement.lineCount,
      });
      evidence.push({
        id: evidenceId,
        factId: fact.id,
        text: exhibit.wrappedText,
        lineCount: exhibit.lineCount,
      });
      consistencyKey.push({
        statementId,
        evidenceId,
        factId: fact.id,
        assertedValue,
        establishedValue: fact.truthValue,
        contradicts: assertedValue !== fact.truthValue,
      });
    });
    return toolSuccess(
      snBoundOutput({
        statements,
        evidence: snSample(evidence, evidence.length, false, random),
        consistencyKey,
        provenance: "caller-supplied-fiction",
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const unreliableNarratorEvidenceExample = {
  input: {
    facts: [
      {
        id: "gate",
        label: "gate state",
        truthValue: "open",
        alternativeValues: ["closed"],
        evidenceTemplates: ["The log records {label}: {value}."],
      },
      {
        id: "parcel",
        label: "parcel color",
        truthValue: "blue",
        alternativeValues: ["red"],
        evidenceTemplates: ["The log records {label}: {value}."],
      },
    ],
    narratorTemplates: ["I recall {label}: {value}."],
    count: 2,
    contradictionCount: 1,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    statements: [
      {
        id: "statement-1",
        factId: "parcel",
        text: "I recall parcel color: red.",
        lineCount: 1,
      },
      {
        id: "statement-2",
        factId: "gate",
        text: "I recall gate state: open.",
        lineCount: 1,
      },
    ],
    evidence: [
      {
        id: "evidence-2",
        factId: "gate",
        text: "The log records gate state: open.",
        lineCount: 1,
      },
      {
        id: "evidence-1",
        factId: "parcel",
        text: "The log records parcel color: blue.",
        lineCount: 1,
      },
    ],
    consistencyKey: [
      {
        statementId: "statement-1",
        evidenceId: "evidence-1",
        factId: "parcel",
        assertedValue: "red",
        establishedValue: "blue",
        contradicts: true,
      },
      {
        statementId: "statement-2",
        evidenceId: "evidence-2",
        factId: "gate",
        assertedValue: "open",
        establishedValue: "open",
        contradicts: false,
      },
    ],
    provenance: "caller-supplied-fiction",
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  UnreliableNarratorEvidenceInput,
  UnreliableNarratorEvidenceOutput
>;
export const unreliableNarratorEvidenceTool = createModelDefinition<
  UnreliableNarratorEvidenceInput,
  UnreliableNarratorEvidenceOutput
>({
  id: "random/unreliable-narrator-evidence",
  title: "Random Unreliable Narrator Evidence Deck Generator",
  description:
    "Compose supplied fictional assertions and conflicting evidence with an exact contradiction count, shuffled exhibits, and an explicit consistency key.",
  inputSchema,
  outputSchema,
  execute: calculateUnreliableNarratorEvidence,
});
export const runUnreliableNarratorEvidence =
  unreliableNarratorEvidenceTool.execute;
export default unreliableNarratorEvidenceTool;
