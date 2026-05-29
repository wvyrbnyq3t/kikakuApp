import { deleteQuiz, updateQuiz } from "../features/quizzes/api/quizApi";
import { fetchQuizById } from "../features/quizzes/api/quizApi";

import { Button, IconButton } from "../components/Button";
import {
  PageContent,
  PageFooter,
  PageHeader,
  PageHeaderTitle,
} from "../components/PageLayout";
import { Section, SectionTitle } from "../components/Section";
import {
  FormField,
  FormLabel,
  FormRadio,
  FormSelect,
  FormText,
  FormTextarea,
} from "../components/Form";
import { AppConfirm } from "../libs/dialog/AppConfirm";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";
import { useUserAuth } from "../features/auth/hooks/useUserAuth";

import type {
  QuizDataType,
  QuizOptionType,
} from "../features/quizzes/types/quizTypes";
import { GridContaienr } from "../components/GridContainer";
import RequiredSignIn from "./RequiredSignIn";

const EditQuiz = () => {
  const [isSugmitting, setIsSubmitting] = useState<boolean>(false);
  const [prevQuizData, setPrevQuizData] = useState<QuizDataType | null>(null);
  const [newQuizData, setNewQuizData] = useState<{
    quizTitle: string;
    description: string;
    type: "single" | "text" | null;
    options: QuizOptionType[] | null;
  }>({
    quizTitle: "",
    description: "",
    type: null,
    options: null,
  });

  const { eventId, quizId } = useParams();
  const { showToast } = useToast();
  const { authUser } = useUserAuth();
  const nav = useNavigate();

  // フォーム内容が過不足に確認する
  const isFormValid = () => {
    if (!newQuizData.quizTitle || !newQuizData.type) {
      return false;
    }

    if (newQuizData.type === "single") {
      if (!newQuizData.options || newQuizData.options.length < 2) {
        return false;
      }
      const hasCorrectOption = newQuizData.options.some(
        (option) => option.isCorrect,
      );
      if (!hasCorrectOption) {
        return false;
      }
      if (newQuizData.options.filter((opt) => opt.label === "").length > 0) {
        return false;
      }
    }

    return true;
  };

  const onMounted = async () => {
    if (!eventId) return;

    try {
      const quiz = (await fetchQuizById(eventId, quizId || "")) as QuizDataType;
      setPrevQuizData(quiz);
      setNewQuizData({
        quizTitle: quiz.quizTitle,
        description: quiz.description,
        type: quiz.type,
        options: quiz.options,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    onMounted();
  }, [eventId]);

  if (!authUser) return <RequiredSignIn />;

  return (
    <>
      <PageHeader position="sticky">
        <IconButton variant="ghost" onClick={() => nav(-1)}>
          arrow_back_ios_new
        </IconButton>
        <PageHeaderTitle>
          {prevQuizData?.quizTitle || "クイズ編集"}
        </PageHeaderTitle>
      </PageHeader>
      <PageContent>
        <Section>
          <SectionTitle level={2}>基本情報</SectionTitle>
          <FormField>
            <FormLabel htmlFor="quizTitle">クイズ名</FormLabel>
            <FormText
              id="quizTitle"
              name="quizTitle"
              placeholder="一番かっこいい先輩は誰？"
              value={newQuizData.quizTitle}
              onChange={(e) =>
                setNewQuizData({ ...newQuizData, quizTitle: e.target.value })
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="description">クイズの説明</FormLabel>
            <FormTextarea
              rows={4}
              id="description"
              name="description"
              placeholder="クイズの説明を入力してください"
              value={newQuizData.description}
              onChange={(e) =>
                setNewQuizData({ ...newQuizData, description: e.target.value })
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="type">クイズの種類</FormLabel>
            <FormSelect
              id="type"
              name="type"
              options={[
                {
                  value: "single",
                  label: "単一選択",
                },
                {
                  value: "text",
                  label: "記述",
                },
              ]}
              value={newQuizData.type || ""}
              onChange={(e) =>
                setNewQuizData({ ...newQuizData, type: e.target.value as any })
              }
            ></FormSelect>
          </FormField>
        </Section>
        {newQuizData.type === "single" && (
          <Section>
            <SectionTitle level={3}>選択肢</SectionTitle>
            {newQuizData.options?.map(
              (option: QuizOptionType, index: number) => (
                <div className="l-flexbox" key={index}>
                  <FormRadio
                    className="u-width--full"
                    checked={option.isCorrect}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const prevOptions = newQuizData.options;
                      const newOptions = prevOptions?.map(
                        (opt: QuizOptionType) => {
                          if (opt.optionId === option.optionId) {
                            return { ...opt, isCorrect: e.target.checked };
                          }
                          return {
                            ...opt,
                            isCorrect: false,
                          };
                        },
                      );
                      setNewQuizData({
                        ...newQuizData,
                        options: newOptions || null,
                      });
                    }}
                    name="isCorrect"
                    id={option.optionId}
                  >
                    <FormText
                      name="selectType"
                      placeholder={`選択肢${index + 1}`}
                      value={option.label}
                      id={option.value}
                      onChange={(e) => {
                        const newOptions = newQuizData.options?.map((opt) => {
                          if (opt.optionId === option.optionId) {
                            return {
                              ...opt,
                              label: e.target.value,
                              value: e.target.value,
                            };
                          }
                          return opt;
                        });

                        setNewQuizData({
                          ...newQuizData,
                          options: newOptions || null,
                        });
                      }}
                    />
                  </FormRadio>
                  <IconButton
                    variant="ghost"
                    className="u-mrgn--left-auto"
                    onClick={() => {
                      const filterdOptions = newQuizData.options?.filter(
                        (opt) => {
                          return opt.optionId !== option.optionId;
                        },
                      );

                      setNewQuizData({
                        ...newQuizData,
                        options: filterdOptions || null,
                      });
                    }}
                    aria-disabled={newQuizData.options?.length === 1}
                  >
                    delete
                  </IconButton>
                </div>
              ),
            )}
            <Button
              variant="primary"
              icon="add"
              className="u-mrgn--left-auto"
              onClick={() => {
                const newOptions = [
                  ...(newQuizData.options || []),
                  {
                    optionId: crypto.randomUUID(),
                    label: "",
                    value: "",
                    isCorrect: false,
                  },
                ];
                setNewQuizData((prev) => ({
                  ...prev,
                  options: newOptions || null,
                }));
              }}
            >
              追加する
            </Button>
          </Section>
        )}
      </PageContent>
      <PageFooter>
        <GridContaienr columns={2} gap="var(--space-sm)">
          <Button
            variant="danger"
            className="u-width--full"
            onClick={async () => {
              const confirm = await AppConfirm({
                title: `クイズを削除しますか？`,
                description: "一度実行すると元には戻せません",
              });

              if (!confirm) return;
              await deleteQuiz(eventId || "", quizId || "");
              nav(-1);
            }}
          >
            削除する
          </Button>
          <Button
            variant="primary"
            className="u-width--full"
            aria-disabled={!isFormValid() || isSugmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                await updateQuiz(
                  eventId || "",
                  prevQuizData?.quizId || "",
                  newQuizData.quizTitle,
                  newQuizData.type!,
                  newQuizData.description,
                  newQuizData.options,
                );
                showToast({
                  title: "クイズを更新しました",
                });
              } catch (err) {
                console.error(err);
                showToast({
                  title: "クイズの更新に失敗しました",
                  message: "時間をおいて再度お試しください",
                  icon: "error",
                });
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            保存する
          </Button>
        </GridContaienr>
      </PageFooter>
    </>
  );
};

export default EditQuiz;
