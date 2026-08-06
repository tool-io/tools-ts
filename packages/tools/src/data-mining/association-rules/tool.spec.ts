import { describe, expect, it } from "vitest";
import { associationRulesExample, runAssociationRules } from "./tool.js";
describe("association rules", () => {
  it("publishes an executable example", () =>
    expect(runAssociationRules(associationRulesExample.input)).toEqual({
      ok: true,
      output: associationRulesExample.output,
    }));
});
