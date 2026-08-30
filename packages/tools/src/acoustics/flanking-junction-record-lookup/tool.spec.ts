import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateFlankingPathJunctionDetailCorrectionLookup,
  example,
} from "./tool.js";

describe("acoustics/flanking-junction-record-lookup", () => {
  it("executes its canonical example exactly", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("subtracts an apparent rating from its matching direct rating", () => {
    const detail = example.input.details[0];
    expect(
      calculateFlankingPathJunctionDetailCorrectionLookup({
        details: [{ ...detail, apparentRating: 48, directRating: 55 }],
        queryDetailId: detail.detailId,
      }),
    ).toMatchObject({
      calculation: "difference-of-reported-ratings",
      ratingDifferenceDecibels: 7,
    });
  });

  it("rejects an identifier absent from the supplied records", () => {
    expect(
      tool.execute({ ...example.input, queryDetailId: "missing" }),
    ).toMatchObject({
      error: { issues: [{ code: "detail_not_found", field: "queryDetailId" }] },
      ok: false,
    });
  });
});
