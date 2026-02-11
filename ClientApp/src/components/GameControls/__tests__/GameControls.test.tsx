import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameControls } from "../GameControls";

describe("GameControls", () => {
  it("fires handlers when enabled", async () => {
    const user = userEvent.setup();
    const onHit = vi.fn();
    const onStand = vi.fn();
    const onContinue = vi.fn();

    render(
      <GameControls
        onHit={onHit}
        onStand={onStand}
        onContinue={onContinue}
      />
    );

    await user.click(screen.getByRole("button", { name: "Hit" }));
    await user.click(screen.getByRole("button", { name: "Stand" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onHit).toHaveBeenCalledTimes(1);
    expect(onStand).toHaveBeenCalledTimes(1);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("disables buttons independently", () => {
    const onHit = vi.fn();
    const onStand = vi.fn();
    const onContinue = vi.fn();

    render(
      <GameControls
        onHit={onHit}
        onStand={onStand}
        onContinue={onContinue}
        hitStandDisabled={true}
        continueDisabled={true}
      />
    );

    expect(screen.getByRole("button", { name: "Hit" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Stand" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });
});
