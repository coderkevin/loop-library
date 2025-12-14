import { describe, expect, it } from "vitest";
import { sum } from "./sum";

describe("sum", () => {
  it("adds numbers together", () => {
    expect(sum(1, 2, 3)).toBe(6);
  });

  it("returns 0 with no arguments", () => {
    expect(sum()).toBe(0);
  });
});

