import { expect, test } from "../fixtures";
import { PairwiseEvaluationPage } from "../pages/PairwiseEvaluationPage";

test.describe("Pairwise evaluation", () => {
  // Trace (temporary): Project Description §4.5.1, FR-EVAL-04
  test("student can save a selected pair as draft", async ({ page }) => {
    const evaluationPage = new PairwiseEvaluationPage(page);

    await evaluationPage.goto();
    await evaluationPage.selectCandidateA();

    await expect(evaluationPage.saveDraftButton).toBeEnabled();

    await evaluationPage.saveDraft();

    await expect(evaluationPage.successMessage).toBeVisible();
  });
    // Trace (temporary): Project Description §4.5.1, FR-EVAL-02
  test("student advances to the next pair after making a selection", async ({
    page,
  }) => {
    const evaluationPage = new PairwiseEvaluationPage(page);

    await evaluationPage.goto();
    await expect(evaluationPage.pairProgress).toHaveText("PAIR 3 / 5");

    await evaluationPage.selectCandidateB();
    await expect(evaluationPage.nextPairButton).toBeEnabled();

    await evaluationPage.goToNextPair();

    await expect(evaluationPage.pairProgress).toHaveText("PAIR 4 / 5");
  });
    // Temporary trace: Story 4 draft-save flow; UI guard before a choice is made.
  test("student cannot save a draft before selecting a candidate", async ({
    page,
  }) => {
    const evaluationPage = new PairwiseEvaluationPage(page);

    await evaluationPage.goto();

    await expect(evaluationPage.saveDraftButton).toBeDisabled();
  });
});
