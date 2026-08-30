import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateImpactInsulationClassIicFloorAssemblyTableLookup,
  example,
} from "./tool.js";

describe("acoustics/iic-floor-assembly-lookup", () => {
  it("executes its canonical example exactly", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("selects the highest matching caller-supplied IIC", () => {
    const assembly = example.input.assemblies[0];
    expect(
      calculateImpactInsulationClassIicFloorAssemblyTableLookup({
        assemblies: [
          assembly,
          { ...assembly, assemblyId: "higher", reportedIic: 58 },
        ],
        query: {},
      }).selectedAssembly,
    ).toMatchObject({ assemblyId: "higher", reportedIic: 58 });
  });

  it("rejects filters with no matching assembly", () => {
    expect(
      tool.execute({ ...example.input, query: { minimumIic: 90 } }),
    ).toMatchObject({
      error: { issues: [{ code: "no_matching_assembly", field: "query" }] },
      ok: false,
    });
  });
});
