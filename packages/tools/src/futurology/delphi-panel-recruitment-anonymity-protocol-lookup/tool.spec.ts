import { describe, expect, it } from "vitest";
import {
  buildDelphiRecruitmentAnonymityProtocol,
  delphiAnonymityExample,
  runDelphiAnonymity,
} from "./tool.js";

describe("Delphi panel recruitment anonymity protocol lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runDelphiAnonymity(delphiAnonymityExample.input)).toEqual({
      ok: true,
      output: delphiAnonymityExample.output,
    });
  });

  it("warns about a small cohort", () => {
    expect(
      buildDelphiRecruitmentAnonymityProtocol({
        anonymityThresholdPercent: 50,
        identityDataNeeded: ["contact"],
        participantCount: 5,
        recruitmentChannels: ["list"],
      }),
    ).toMatchObject({ protocolReady: false, smallCohortWarning: true });
  });

  it("separates recruitment and panel identifiers", () => {
    expect(
      buildDelphiRecruitmentAnonymityProtocol({
        anonymityThresholdPercent: 50,
        identityDataNeeded: ["contact"],
        participantCount: 10,
        recruitmentChannels: ["list"],
      }).anonymityDesign[1],
    ).toContain("separately");
  });

  it("rejects a zero anonymity threshold", () => {
    expect(
      runDelphiAnonymity({
        anonymityThresholdPercent: 0,
        identityDataNeeded: ["contact"],
        participantCount: 10,
        recruitmentChannels: ["list"],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "anonymityThresholdPercent",
          },
        ],
      },
      ok: false,
    });
  });
});
