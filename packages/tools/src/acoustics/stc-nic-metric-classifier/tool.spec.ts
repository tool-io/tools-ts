import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateAstmE90LabStcVersusFieldNicDistinctionLookup,
  example,
} from "./tool.js";

describe("acoustics/stc-nic-metric-classifier", () => {
  it("executes its canonical example exactly", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("distinguishes field NIC from laboratory STC", () => {
    expect(
      calculateAstmE90LabStcVersusFieldNicDistinctionLookup({
        ...example.input,
        queryRecordId: "caller-field-nic",
      }),
    ).toMatchObject({ classification: "field-room-isolation" });
  });

  it("rejects a method and metric mismatch", () => {
    expect(
      tool.execute({
        queryRecordId: "bad",
        records: [
          {
            ...example.input.records[0],
            environment: "field",
            recordId: "bad",
          },
        ],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "method_metric_mismatch", field: "records" }] },
      ok: false,
    });
  });
});
