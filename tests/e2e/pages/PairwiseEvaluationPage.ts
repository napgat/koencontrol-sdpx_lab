import { Locator, Page } from "@playwright/test";

export class PairwiseEvaluationPage {
  readonly candidateAButton: Locator;
  readonly candidateBButton: Locator;
  readonly tieButton: Locator;
  readonly saveDraftButton: Locator;
  readonly nextPairButton: Locator;
  readonly successMessage: Locator;
  readonly pairProgress: Locator;

  constructor(private readonly page: Page) {
    this.candidateAButton = page.getByRole("button", {
      name: /Group 01: Smart Campus IoT/i,
    });
    this.candidateBButton = page.getByRole("button", {
      name: /Group 04: AI Vision Nav/i,
    });
    this.tieButton = page.getByRole("button", { name: /Tie \/ Equal/i });
    this.saveDraftButton = page.getByRole("button", { name: /Save Draft/i });
    this.nextPairButton = page.getByRole("button", { name: /Next Pair/i });
    this.successMessage = page.getByTestId("success-msg");
    this.pairProgress = page.getByTestId("pair-progress");
  }
    async goto() {
    await this.page.goto("/");
  }

  async selectCandidateA() {
    await this.candidateAButton.click();
  }

  async selectCandidateB() {
    await this.candidateBButton.click();
  }

  async selectTie() {
    await this.tieButton.click();
  }

  async saveDraft() {
    await this.saveDraftButton.click();
  }

  async goToNextPair() {
    await this.nextPairButton.click();
  }
}