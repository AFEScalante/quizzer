import { useForm, useFieldArray, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion"; //eslint-disable-line
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { NeoBtn } from "../components/NeoBtn";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

const QuestionBuilder = ({ quizzes = [], onSubmit }) => {
  const { quizId } = useParams();

  const existingQuiz = quizId
    ? quizzes.find((quiz) => quiz.id === parseInt(quizId))
    : null;

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: existingQuiz?.id || null,
      title: existingQuiz?.title || "",
      questions: existingQuiz?.questions || [
        {
          text: "",
          options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
          correctOption: null,
        },
      ],
    },
  });

  // Si estamos editando, prellenar el formulario
  useEffect(() => {
    if (existingQuiz) {
      reset({
        id: existingQuiz.id,
        title: existingQuiz.title,
        questions: existingQuiz.questions,
      });
    }
  }, [existingQuiz, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
    rules: {
      required: "At least one question is required",
    },
  });

  const handleAddQuestion = () => {
    append({
      text: "",
      options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      correctOption: null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6">
      {/* Botones de acción en la parte superior */}
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/"
          className="shadow-solid text-sm px-4 py-2  rounded-md border-2 text-gray-600 bg-amber-300 hover:bg-amber-400 transition flex items-center hover:text-gray-800"
        >
          <FaArrowLeft />
        </Link>
        <NeoBtn type="submit" className="bg-green-400 text-sm">
          Save Quiz
        </NeoBtn>
      </div>

      {/* Título del Quiz */}
      <div className="mb-8">
        <input
          {...register("title", { required: "Quiz title is required" })}
          placeholder="Enter quiz title"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-md"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Botón para añadir pregunta */}
      <div className="mb-6">
        <NeoBtn
          type="button"
          className="bg-blue-200 text-sm w-full"
          onClick={handleAddQuestion}
        >
          <div className="flex gap-2 items-center justify-center">
            <FaPlus />
            Add new question
          </div>
        </NeoBtn>
      </div>

      {/* Lista de preguntas */}
      <div className="space-y-6">
        <AnimatePresence mode="asynchronous">
          {fields.map((question, questionIndex) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-100 rounded-xl p-6 border border-gray-900"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Question #{questionIndex + 1}
                </h3>
                <NeoBtn
                  type="button"
                  className="bg-red-400 text-sm p-0"
                  onClick={() => remove(questionIndex)}
                >
                  Delete
                </NeoBtn>
              </div>

              {/* Question text */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  {...register(`questions.${questionIndex}.text`, {
                    required: "Question text is required",
                  })}
                  placeholder="What is the capital of France?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="3"
                />
                {errors.questions?.[questionIndex]?.text && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.questions[questionIndex].text.message}
                  </p>
                )}
              </div>

              {/* Answer options */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options:
                </label>

                {[0, 1, 2, 3].map((optionIndex) => (
                  <motion.div
                    key={optionIndex}
                    className="flex items-start space-x-3"
                    custom={optionIndex}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center h-10">
                      <Controller
                        control={control}
                        name={`questions.${questionIndex}.correctOption`}
                        render={({ field }) => (
                          <input
                            type="radio"
                            checked={field.value === optionIndex}
                            onChange={() => field.onChange(optionIndex)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                          />
                        )}
                      />
                    </div>

                    <div className="flex-1">
                      <input
                        {...register(
                          `questions.${questionIndex}.options.${optionIndex}.text`,
                          { required: "Option text is required" }
                        )}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="w-full text-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      {errors.questions?.[questionIndex]?.options?.[optionIndex]
                        ?.text && (
                        <p className="text-red-500 text-xs mt-1">
                          {
                            errors.questions[questionIndex].options[optionIndex]
                              .text.message
                          }
                        </p>
                      )}
                    </div>

                    <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 font-medium text-sm border-1">
                      {optionIndex + 1}
                    </span>
                  </motion.div>
                ))}

                <div className="flex gap-2 mt-3 ml-8 text-sm text-gray-500 items-center">
                  <FaCircleInfo /> Select the correct answer
                </div>
                {errors.questions?.[questionIndex]?.correctOption && (
                  <p className="text-red-500 text-sm mt-1 ml-8">
                    You must select the correct answer for this question
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {errors.questions?.root && (
        <p className="font-bold text-red-400 p-4 mt-4 bg-red-50 rounded-lg border border-red-200">
          {errors.questions?.root?.message}
        </p>
      )}

      {/* Botón para añadir otra pregunta en la parte inferior */}
      {fields.length > 0 && (
        <motion.div className="mt-8" exit={{ opacity: 0, scale: 0 }}>
          <NeoBtn
            type="button"
            className="bg-blue-200 text-sm w-full"
            onClick={handleAddQuestion}
          >
            <div className="flex gap-2 items-center justify-center">
              <FaPlus /> Add another question
            </div>
          </NeoBtn>
        </motion.div>
      )}
    </form>
  );
};

export default QuestionBuilder;
