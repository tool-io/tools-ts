import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateStcWallAssemblyLayeredGypsumConfigurationsTable,
  example,
} from "./tool.js";

describe("acoustics/layered-gypsum-wall-stc-lookup", () => {
  it("executes its canonical example exactly", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("selects the highest-rated matching wall assembly", () => {
    expect(
      calculateStcWallAssemblyLayeredGypsumConfigurationsTable({
        ...example.input,
        query: { framing: "steel" },
      }).selectedAssembly,
    ).toMatchObject({
      assemblyId: "usg-steel-resilient-double",
      reportedStc: 63,
    });
  });

  it("rejects filters with no matching assembly", () => {
    expect(
      tool.execute({ ...example.input, query: { minimumStc: 90 } }),
    ).toMatchObject({
      error: { issues: [{ code: "no_matching_assembly", field: "query" }] },
      ok: false,
    });
  });
});
