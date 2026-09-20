import { describe, expect, it } from "vitest";
import tool, {
  calculateUnreliableNarratorEvidence,
  unreliableNarratorEvidenceExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateUnreliableNarratorEvidence, example);
  it("independently audits every factual value and reference in the fictional consistency key", () => {
    for (let seed = 0; seed < 8; seed += 1) {
      const result = tool.execute({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      expect(
        result.output.consistencyKey.filter((key) => key.contradicts),
      ).toHaveLength(1);
      expect(
        new Set(result.output.consistencyKey.map((key) => key.factId)).size,
      ).toBe(2);
      for (const key of result.output.consistencyKey) {
        const fact = example.input.facts.find(
          (entry) => entry.id === key.factId,
        );
        if (!fact) throw new Error("Unexpected invented fact");
        expect(key.establishedValue).toBe(fact.truthValue);
        expect(key.contradicts).toBe(key.assertedValue !== fact.truthValue);
        const statement = result.output.statements.find(
            (entry) => entry.id === key.statementId,
          ),
          evidence = result.output.evidence.find(
            (entry) => entry.id === key.evidenceId,
          );
        expect(statement?.factId).toBe(key.factId);
        expect(evidence?.factId).toBe(key.factId);
        expect(statement?.text).toBe(
          `I recall ${fact.label}: ${key.assertedValue}.`,
        );
        expect(evidence?.text).toBe(
          `The log records ${fact.label}: ${fact.truthValue}.`,
        );
      }
      expect(result.output.provenance).toBe("caller-supplied-fiction");
    }
  });
  it("composes all-consistent controls and all-conflicting decks exactly as requested", () => {
    for (const contradictionCount of [0, 2]) {
      const result = tool.execute({ ...example.input, contradictionCount });
      if (!result.ok) throw new Error("Expected success");
      expect(
        result.output.consistencyKey.filter((key) => key.contradicts),
      ).toHaveLength(contradictionCount);
    }
  });
  it("requires real conflicting values and visible evidence values, including unselected facts", () => {
    expect(
      tool.execute({
        ...example.input,
        facts: example.input.facts.map((fact) => ({
          ...fact,
          alternativeValues: [],
        })),
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "contradictionCount", code: "infeasible_contradictions" },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        facts: [{ ...example.input.facts[0], alternativeValues: ["open"] }],
        count: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "facts", code: "nonconflicting_alternative" }],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        facts: [
          {
            ...example.input.facts[0],
            alternativeValues: ["closed", "closed"],
          },
        ],
        count: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "facts", code: "duplicate_id" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        narratorTemplates: ["I remember something."],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "templates", code: "missing_value_token" }] },
    });
  });
  it("preserves supplied content semantics through wrapping and rejects undeclared tokens", () => {
    const result = tool.execute({ ...example.input, wrapWidth: 8 });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.statements[0].text.replace(/\s+/g, " ")).toBe(
      "I recall parcel color: red.",
    );
    expect(result.output.statements[0].lineCount).toBe(
      result.output.statements[0].text.split("\n").length,
    );
    expect(
      tool.execute({
        ...example.input,
        narratorTemplates: ["{value} {diagnosis}"],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "templates", code: "invalid_template" }] },
    });
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});
