import { createQuiz } from "../features/quizzes/api/quizApi";

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

import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/Toast";
import React, { useState } from "react";

import type { QuizOptionType } from "../features/quizzes/types/quizTypes";
import { Loading } from "../components/Loading";
import RequiredSignIn from "./RequiredSignIn";
import { useUserAuth } from "../features/auth/hooks/useUserAuth";

const CreateNewQuiz = () => {
  const [isSugmitting, setIsSubmitting] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<{
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

  const { eventId } = useParams();
  const { showToast } = useToast();
  const { authUser } = useUserAuth();
  const nav = useNavigate();

  // フォーム内容が過不足に確認する
  const isFormValid = () => {
    if (!quizData.quizTitle || !quizData.type) {
      return false;
    }

    if (quizData.type === "single") {
      if (!quizData.options || quizData.options.length < 2) {
        return false;
      }
      const hasCorrectOption = quizData.options.some(
        (option) => option.isCorrect,
      );
      if (!hasCorrectOption) {
        return false;
      }
      if (quizData.options.filter((opt) => opt.label === "").length > 0) {
        return false;
      }
    }

    return true;
  };

  if (isSugmitting) return <Loading />;
  if (!authUser) return <RequiredSignIn />;

  return (
    <>
      <PageHeader position="sticky">
        <IconButton variant="ghost" onClick={() => nav(-1)}>
          arrow_back_ios_new
        </IconButton>
        <PageHeaderTitle>新規クイズ作成</PageHeaderTitle>
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
              value={quizData.quizTitle}
              onChange={(e) =>
                setQuizData({ ...quizData, quizTitle: e.target.value })
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
              value={quizData.description}
              onChange={(e) =>
                setQuizData({ ...quizData, description: e.target.value })
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
                  label: "自由記述",
                },
              ]}
              value={quizData.type || ""}
              onChange={(e) =>
                setQuizData({ ...quizData, type: e.target.value as any })
              }
            ></FormSelect>
          </FormField>
        </Section>
        {quizData.type === "single" && (
          <Section>
            <SectionTitle level={3}>選択肢</SectionTitle>
            {quizData.options?.map((option: QuizOptionType, index: number) => (
              <div className="l-flexbox" key={index}>
                <FormRadio
                  className="u-width--full"
                  checked={option.isCorrect}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const prevOptions = quizData.options;
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
                    setQuizData({ ...quizData, options: newOptions || null });
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
                      const newOptions = quizData.options?.map((opt) => {
                        if (opt.optionId === option.optionId) {
                          return {
                            ...opt,
                            label: e.target.value,
                          };
                        }
                        return opt;
                      });

                      setQuizData({
                        ...quizData,
                        options: newOptions || null,
                      });
                    }}
                  />
                </FormRadio>
                <IconButton
                  variant="ghost"
                  className="u-mrgn--left-auto"
                  onClick={() => {
                    const filterdOptions = quizData.options?.filter((opt) => {
                      return opt.optionId !== option.optionId;
                    });

                    setQuizData({
                      ...quizData,
                      options: filterdOptions || null,
                    });
                  }}
                  aria-disabled={quizData.options?.length === 1}
                >
                  delete
                </IconButton>
              </div>
            ))}
            <IconButton
              variant="filled"
              className="u-mrgn--left-auto"
              onClick={() => {
                const newOptionId = crypto.randomUUID();
                const newOptions = [
                  ...(quizData.options || []),
                  {
                    optionId: newOptionId,
                    label: "",
                    value: newOptionId,
                    isCorrect: false,
                  },
                ];
                setQuizData((prev) => ({
                  ...prev,
                  options: newOptions || null,
                }));
              }}
            >
              add
            </IconButton>
          </Section>
        )}
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          className="u-width--full"
          aria-disabled={!isFormValid() || isSugmitting}
          onClick={async () => {
            try {
              setIsSubmitting(true);
              await createQuiz(
                eventId || "",
                quizData.quizTitle,
                quizData.type!,
                quizData.description,
                quizData.options,
              );
              showToast({
                title: "クイズを作成しました",
                icon: "check",
              });
              nav(-1);
            } catch (err) {
              console.error(err);
              showToast({
                title: "クイズの作成に失敗しました",
                icon: "error",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          追加する
        </Button>
      </PageFooter>
    </>
  );
};

export default CreateNewQuiz;
