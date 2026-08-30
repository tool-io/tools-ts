import { describe, expect, it } from "vitest";
import {
  assessFraudBrainstormingElements,
  fraudBrainstormingExample,
  runFraudBrainstorming,
} from "./tool.js";

describe("fraud brainstorming required elements checklist", () => {
  it("reproduces its canonical example", () => {
    expect(runFraudBrainstorming(fraudBrainstormingExample.input)).toEqual({
      ok: true,
      output: fraudBrainstormingExample.output,
    });
  });

  it("is complete only when every element is addressed", () => {
    expect(
      assessFraudBrainstormingElements({
        consideredManagementOverride: true,
        consideredSusceptibilityToFraud: true,
        discussedKnownFraudRisks: true,
        documentedParticipantsAndConclusions: true,
      }),
    ).toMatchObject({ complete: true, completedElementCount: 4 });
  });

  it("lists every omitted element", () => {
    expect(
      assessFraudBrainstormingElements({
        consideredManagementOverride: false,
        consideredSusceptibilityToFraud: true,
        discussedKnownFraudRisks: false,
        documentedParticipantsAndConclusions: true,
      }).missingElements,
    ).toEqual([
      "known fraud risks and allegations",
      "risk of management override",
    ]);
  });
});
