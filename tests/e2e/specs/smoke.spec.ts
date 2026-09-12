// import { expect, test } from "../fixtures";

// test("homepage loads and student can save a selected pair as draft", async ({
//   page,
// }) => {
//   await page.goto("/");

//   await expect(page).toHaveTitle(/PairEval/);
//   await expect(page.getByRole("navigation")).toBeVisible();

//   await page.getByTestId("candidate-a-card").click();
//   await expect(page.getByTestId("save-draft-btn")).toBeEnabled();

//   await page.getByTestId("save-draft-btn").click();
//   await expect(page.getByText("Draft Saved")).toBeVisible();
// });

import { expect, test } from "../fixtures";
import { PairwiseEvaluationPage } from "../pages/PairwiseEvaluationPage";

test("homepage loads and student can save a selected pair as draft", async ({
  page,
}) => {
  const evaluationPage = new PairwiseEvaluationPage(page);

  await evaluationPage.goto();

  await expect(page).toHaveTitle(/PairEval/);
  await expect(page.getByRole("navigation")).toBeVisible();

  await evaluationPage.selectCandidateA();
  await expect(evaluationPage.saveDraftButton).toBeEnabled();

  await evaluationPage.saveDraft();
  await expect(evaluationPage.successMessage).toBeVisible();
});