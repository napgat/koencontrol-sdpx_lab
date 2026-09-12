import { expect, test } from "../fixtures";
import { PairwiseEvaluationPage } from "../pages/PairwiseEvaluationPage";

test.describe("Pairwise evaluation", () => {
  // Trace: GitHub Issue #4 — https://github.com/napgat/koencontrol-sdpx_lab/issues/4
  // AC: Given assigned pairs, when a student selects one or more pairs and saves,
  // then the system stores the answers as a draft.
  test("student can save a selected pair as draft", async ({ page }) => {
    const evaluationPage = new PairwiseEvaluationPage(page);

    await evaluationPage.goto();
    await evaluationPage.selectCandidateA();

    await expect(evaluationPage.saveDraftButton).toBeEnabled();

    await evaluationPage.saveDraft();

    await expect(evaluationPage.successMessage).toBeVisible();
  });

  // Trace: GitHub Issue #3 — https://github.com/napgat/koencontrol-sdpx_lab/issues/3
  // AC: Given I am evaluating my assigned pairs, when I select an outcome for
  // the current pair and choose Next Pair, then the system displays the next assigned pair.
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

  // Edge/UI guard: Save Draft remains disabled until a candidate is selected.
  // This is not an access-control scenario.
  test("student cannot save a draft before selecting a candidate", async ({
    page,
  }) => {
    const evaluationPage = new PairwiseEvaluationPage(page);

    await evaluationPage.goto();

    await expect(evaluationPage.saveDraftButton).toBeDisabled();
  });
});
